import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  FileVideo,
  Music,
  Database,
} from "lucide-react";
import { 
  FaCss3Alt, 
  FaFileAlt, 
  FaFileArchive, 
  FaFileAudio, 
  FaFileExcel, 
  FaFileImage, 
  FaFilePdf, 
  FaFileVideo, 
  FaFileWord, 
  FaHtml5, 
  FaJava, 
  FaJs, 
  FaPhp, 
  FaPython, 
  FaReact, 
  FaVuejs,
  FaGitAlt,
  FaMarkdown,
  FaDocker
} from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { 
  SiRuby, 
  SiTypescript, 
  SiJson, 
  SiRust, 
  SiSvelte,
  SiKotlin,
  SiSwift,
  SiCplusplus,
  SiC,
  SiYaml,
  SiXml,
  SiSqlite
} from "react-icons/si";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import React from "react";

export const getFileIcon = (filename: string): React.ReactElement => {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    // Image files
    case "jpg":
    case "jpeg":
      return React.createElement(FaFileImage, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "png":
      return React.createElement(FaFileImage, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "gif":
    case "webp":
    case "svg":
      return React.createElement(ImageIcon, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Document files
    case "pdf":
      return React.createElement(FaFilePdf, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "doc":
    case "docx":
      return React.createElement(FaFileWord, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "txt":
      return React.createElement(FaFileAlt, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "md":
      return React.createElement(FaMarkdown, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Spreadsheet files
    case "xls":
    case "xlsx":
      return React.createElement(FaFileExcel, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "csv":
      return React.createElement(FileSpreadsheet, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Archive files
    case "zip":
    case "rar":
    case "tar":
    case "gz":
    case "7z":
    case "bz2":
    case "xz":
      return React.createElement(FaFileArchive, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Code files
    case "js":
      return React.createElement(FaJs, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "ts":
    case "tsx":
      return React.createElement(SiTypescript, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "jsx":
      return React.createElement(FaReact, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "py":
      return React.createElement(FaPython, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "java":
      return React.createElement(FaJava, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "go":
      return React.createElement(FaGolang, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "php":
      return React.createElement(FaPhp, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "rb":
      return React.createElement(SiRuby, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "html":
      return React.createElement(FaHtml5, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "css":
    case "scss":
    case "sass":
      return React.createElement(FaCss3Alt, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "json":
      return React.createElement(SiJson, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "xml":
      return React.createElement(SiXml, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "yml":
    case "yaml":
      return React.createElement(SiYaml, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Media files
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "webm":
      return React.createElement(FaFileVideo, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "aac":
      return React.createElement(FaFileAudio, {
        className: "w-4 h-4 text-primary-foreground",
      });

    // Other code files
    case "c":
      return React.createElement(SiC, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "cpp":
    case "cc":
    case "cxx":
    case "hpp":
    case "h":
      return React.createElement(SiCplusplus, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "rs":
      return React.createElement(SiRust, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "vue":
      return React.createElement(FaVuejs, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "svelte":
      return React.createElement(SiSvelte, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "kt":
    case "kts":
      return React.createElement(SiKotlin, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "swift":
      return React.createElement(SiSwift, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "sql":
    case "db":
    case "sqlite":
      return React.createElement(SiSqlite, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "dockerfile":
      return React.createElement(FaDocker, {
        className: "w-4 h-4 text-primary-foreground",
      });
    case "gitignore":
    case "gitattributes":
      return React.createElement(FaGitAlt, {
        className: "w-4 h-4 text-primary-foreground",
      });

    default:
      return React.createElement(FileText, {
        className: "w-4 h-4 text-primary-foreground",
      });
  }
};
