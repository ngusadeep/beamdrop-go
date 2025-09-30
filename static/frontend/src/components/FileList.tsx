import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  RefreshCw,
  Archive,
  Folder,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getFileIcon } from "@/lib/utils";

interface FileItem {
  name: string;
  size: string;
  modTime: string; 
  isDir: boolean;
}

interface FileListProps {
  files: FileItem[];
  isLoading: boolean;
  onRefresh: () => void;
  searchTerm?: string;
}



const FileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  onRefresh,
  searchTerm,
}) => {
  const [sortBy, setSortBy] = useState<"name" | "size" | "modTime">("name");

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "size") {
        const parseSize = (s: string) => {
          const [num, unit] = s.split(" ");
          const n = parseFloat(num);
          if (unit === "KB") return n * 1024;
          if (unit === "MB") return n * 1024 * 1024;
          if (unit === "GB") return n * 1024 * 1024 * 1024;
          return n;
        };
        return parseSize(a.size) - parseSize(b.size);
      }
      if (sortBy === "modTime") {
        return new Date(b.modTime).getTime() - new Date(a.modTime).getTime();
      }
      return 0;
    });
  }, [files, sortBy]);

  const downloadFile = (filename: string) => {
    try {
      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = `/download?file=${encodeURIComponent(filename)}`;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `${filename} download initiated.`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="font-mono text-sm font-bold uppercase tracking-wide text-foreground">
            LOADING FILES...
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded border-2 border-border"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
        <div className="font-mono text-sm font-bold uppercase tracking-wide text-foreground">
          {sortedFiles.length} FILE{sortedFiles.length !== 1 ? "S" : ""}{" "}
          {searchTerm ? "FOUND" : "AVAILABLE"}
          {searchTerm && (
            <span className="text-muted-foreground ml-2">for "{searchTerm}"</span>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <select
            aria-label="Sort files by"
            className="border rounded px-2 py-1 font-mono text-xs bg-card text-foreground"
            value={sortBy}
            onChange={(e) => {
              const value = e.target.value;
              if (["name", "size", "modTime"].includes(value)) {
                setSortBy(value as "name" | "size" | "modTime");
              }
            }}
          >
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
            <option value="modTime">Sort: Date</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="w-full sm:w-auto"
            aria-label="Refresh file list"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="font-mono text-xs font-bold uppercase tracking-wide">
              REFRESH
            </span>
          </Button>
        </div>
      </div>

      {sortedFiles.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-muted border-2 border-border rounded flex items-center justify-center mb-4 sm:mb-6">
            <Archive className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-bold font-mono uppercase tracking-wide text-foreground mb-2">
            {searchTerm ? "NO MATCHING FILES" : "NO FILES FOUND"}
          </h3>
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            {searchTerm
              ? "TRY A DIFFERENT SEARCH TERM"
              : "UPLOAD FILES TO BEGIN SHARING"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFiles.map((file) => (
            <div
              key={`${file.name}-${file.modTime}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded border-2 border-border bg-background hover:bg-muted/50 transition-smooth gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="bg-primary p-2 rounded border border-primary flex items-center justify-center flex-shrink-0">
                  {file.isDir ? (
                    <Folder className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    getFileIcon(file.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold font-mono text-foreground truncate">
                    {file.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {file.size}
                    </Badge>
                    {file.isDir && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        FOLDER
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock className="w-3 h-3" />
                      {file.modTime}
                    </div>
                  </div>
                </div>
              </div>
              {!file.isDir && (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => downloadFile(file.name)}
                    size="sm"
                    variant="utilitarian"
                    className="transition-smooth w-full sm:w-auto"
                    aria-label={`Download ${file.name}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;