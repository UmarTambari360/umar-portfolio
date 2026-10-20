#!/usr/bin/env bash
# Usage: ./split-bundle.sh <bundle.txt> [output-dir]
set -euo pipefail

BUNDLE="${1:?Usage: ./split-bundle.sh <bundle.txt> [output-dir]}"
OUTDIR="${2:-.}"

# Marker line: ===== <path>  [NEW|MODIFIED] =====
MARKER='^===== (.+)  \[(NEW|MODIFIED)\] =====$'

current_path=""
writing=0

write_file() {
  # Close the file we were writing (if any)
  if [[ $writing -eq 1 ]]; then
    exec 3>&-   # close fd 3
    writing=0
  fi
}

while IFS= read -r line || [[ -n "$line" ]]; do
  if [[ "$line" =~ $MARKER ]]; then
    write_file
    current_path="${BASH_REMATCH[1]}"
    status="${BASH_REMATCH[2]}"
    full="$OUTDIR/$current_path"
    mkdir -p "$(dirname "$full")"
    if [[ "$status" == "NEW" && -e "$full" ]]; then
      echo "WARNING: $full already exists (marked NEW)" >&2
    fi
    echo "→ $current_path ($status)"
    : > "$full"        # truncate/create
    exec 3>"$full"     # open for writing on fd 3
    writing=1
    continue
  fi

  # Skip the preamble/footer separator lines before the first marker
  [[ $writing -eq 1 ]] || continue

  # Drop the trailing line of equals (===== ... =====) that ends the bundle
  if [[ "$line" == "==============================================================================" ]]; then
    # This is a real separator only if another marker follows; but simplest:
    # treat it as end-of-bundle marker and stop after writing everything else.
    continue
  fi

  printf '%s\n' "$line" >&3
done < "$BUNDLE"

write_file
echo "Done."