import { useEffect, useRef } from "react";
import { updateProject } from "../api/projectApi";

function useAutosave({ projectId, projectName, language, code, stdin, setSaveStatus }) {
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!projectId) {
            return;
        }
        setSaveStatus("typing");
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(async () => {
            try {
                setSaveStatus("saving");
                await updateProject(projectId, { name: projectName, language, code, stdin });
                setSaveStatus("saved");
            }
            catch (err) {
                console.error(err);
            }
        }, 2000);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [projectId, projectName, language, code, stdin]);
}

export default useAutosave;