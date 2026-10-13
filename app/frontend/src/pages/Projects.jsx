import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProjects, createProject } from "../api/projectApi";

function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const load = async () => {
            const data = await getProjects();
            setProjects(data);
        };
        load();
    }, []);
    const handleNewProject = async () => {
        const project = await createProject({ name: "Untitled Project", language: "cpp", code:
`#include <iostream>
using namespace std;

int main() {
    // Write your code here
}`,
            stdin: ""
        });
        navigate(`/?project=${project.id}`);
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-zinc-950 text-white p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Projects</h1>
                    <button onClick={handleNewProject} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer">+ New Project</button>
                </div>
                <div className="space-y-4">
                    {projects.map((project) => (
                        <button key={project.id} onClick={() => navigate(`/?project=${project.id}`)} className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left hover:border-zinc-600 transition cursor-pointer">
                            <h2 className="text-lg font-semibold">{ project.name }</h2>
                            <p className="text-zinc-400">{ project.language }</p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Projects;