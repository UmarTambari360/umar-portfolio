import { useState }                     from "react";
import { safeExternalUrl, statusLabel } from "@/lib/projects";
import type { Project }                 from "@/types/api";
import { DashboardArt, EditorialArt }   from "./project-cover-art";

interface ProjectCoverProps {
  project: Project;
  index: number;
}

export function ProjectCover({ project, index }: ProjectCoverProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = safeExternalUrl(project.imageUrl);
  const showImage = imageUrl !== null && !imageFailed;

  return (
    <div className="relative h-66.75 overflow-hidden bg-art">
      {showImage ? (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          onError={() => {
            setImageFailed(true);
          }}
          className="h-full w-full object-cover"
        />
      ) : index % 2 === 0 ? (
        <EditorialArt
          name={project.name}
          statusText={statusLabel(project.status)}
        />
      ) : (
        <DashboardArt name={project.name} />
      )}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 bg-accent"
      />
    </div>
  );
}
