import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  RefreshCw,
  Archive,
  Folder,
  Clock,
  MoreHorizontal,
  Eye,
  Trash2,
  Star,
  ArrowUpDown,
  FolderOpen,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getFileIcon } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useSettings } from "@/context/settings";

interface FileItem {
  name: string;
  size: string;
  modTime: string;
  isDir: boolean;
  path?: string;
}

interface FileTableProps {
  files: FileItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onNavigate: (path: string) => void;
  onPreview: (fileName: string) => void;
  searchTerm?: string;
  currentPath?: string;
}

type SortField = "name" | "size" | "modTime";
type SortOrder = "asc" | "desc";

const FileTable: React.FC<FileTableProps> = ({
  files,
  isLoading,
  onRefresh,
  onNavigate,
  onPreview,
  searchTerm,
  currentPath = ".",
}) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [starredFiles, setStarredFiles] = useState<Set<string>>(new Set());
  const { showHiddenFiles } = useSettings();

  if (!showHiddenFiles) {
    files = files.filter(file => !file.name.startsWith('.'));
  }
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let comparison = 0;

      // Always show directories first
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          {
            const parseSize = (s: string) => {
              if (a.isDir || b.isDir) return 0; // Directories don't have meaningful size comparison
              const [num, unit] = s.split(" ");
              const n = parseFloat(num);
              if (unit === "KB") return n * 1024;
              if (unit === "MB") return n * 1024 * 1024;
              if (unit === "GB") return n * 1024 * 1024 * 1024;
              return n;
            };
            comparison = parseSize(a.size) - parseSize(b.size);
            break;
          }
        case "modTime":
          comparison = new Date(a.modTime).getTime() - new Date(b.modTime).getTime();
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [files, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDir) {
      const newPath = currentPath === "." ? file.name : `${currentPath}/${file.name}`;
      onNavigate(newPath);
    } else {
      onPreview(file.name);
    }
  };

  const downloadFile = async (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const link = document.createElement('a');
      const filePath = currentPath === "." ? fileName : `${currentPath}/${fileName}`;
      link.href = `/download?file=${encodeURIComponent(filePath)}`;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `${fileName} download initiated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const filePath = currentPath === "." ? fileName : `${currentPath}/${fileName}`;
      const response = await fetch(`/delete?file=${encodeURIComponent(filePath)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onRefresh();
        toast({
          title: "File Deleted",
          description: `${fileName} has been deleted.`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const toggleStar = (fileName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setStarredFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileName)) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-muted-foreground" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-3 h-3 text-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="border border-border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="w-[50%]">Name</TableHead>
                <TableHead className="w-[20%]">Size</TableHead>
                <TableHead className="w-[25%]">Modified</TableHead>
                <TableHead className="w-[5%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="font-mono text-sm font-bold uppercase tracking-wide text-foreground">
          {sortedFiles.length} ITEM{sortedFiles.length !== 1 ? "S" : ""}{" "}
          {searchTerm ? "FOUND" : ""}
          {searchTerm && (
            <span className="text-muted-foreground ml-2">for "{searchTerm}"</span>
          )}
        </div>
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

      {/* File Table */}
      {sortedFiles.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-card">
          <div className="mx-auto w-16 h-16 bg-muted border-2 border-border rounded-full flex items-center justify-center mb-6">
            <Archive className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold font-mono uppercase tracking-wide text-foreground mb-2">
            {searchTerm ? "NO MATCHING FILES" : "FOLDER IS EMPTY"}
          </h3>
          <p className="text-muted-foreground font-mono text-sm">
            {searchTerm
              ? "TRY A DIFFERENT SEARCH TERM"
              : "UPLOAD FILES TO BEGIN SHARING"}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            <div className="space-y-3 p-4">
              {sortedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${file.modTime}`}
                  className="border border-border rounded-lg p-4 bg-card hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-primary p-1.5 rounded border border-primary flex items-center justify-center flex-shrink-0">
                        {file.isDir ? (
                          <Folder className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          getFileIcon(file.name)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-bold text-foreground truncate text-sm">
                            {file.name}
                          </p>
                          {starredFiles.has(file.name) && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                          )}
                        </div>
                        {file.isDir && (
                          <Badge variant="secondary" className="font-mono text-xs mt-1">
                            FOLDER
                          </Badge>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-mono text-xs">
                            {file.size}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {file.modTime}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-2 border-border">
                        {file.isDir ? (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleFileClick(file);
                          }}>
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Open Folder
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              onPreview(file.name);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => downloadFile(file.name, e)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => toggleStar(file.name, e)}>
                          <Star className={cn(
                            "w-4 h-4 mr-2",
                            starredFiles.has(file.name) ? "fill-current text-yellow-500" : ""
                          )} />
                          {starredFiles.has(file.name) ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => deleteFile(file.name, e)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-muted/30">
                    <TableHead className="w-[50%] min-w-[200px] max-w-[400px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 px-0 font-mono text-xs font-bold uppercase tracking-wide"
                      >
                        NAME
                        {getSortIcon("name")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[20%] min-w-[100px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("size")}
                        className="flex items-center gap-2 px-0 font-mono text-xs font-bold uppercase tracking-wide"
                      >
                        SIZE
                        {getSortIcon("size")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[25%] min-w-[150px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("modTime")}
                        className="flex items-center gap-2 px-0 font-mono text-xs font-bold uppercase tracking-wide"
                      >
                        MODIFIED
                        {getSortIcon("modTime")}
                      </Button>
                    </TableHead>
                    <TableHead className="w-[5%] min-w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {sortedFiles.map((file, index) => (
                  <TableRow
                    key={`${file.name}-${file.modTime}`}
                    className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleFileClick(file)}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary p-1.5 rounded border border-primary flex items-center justify-center flex-shrink-0">
                          {file.isDir ? (
                            <Folder className="w-4 h-4 text-primary-foreground" />
                          ) : (
                            getFileIcon(file.name)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p 
                              className="font-mono font-bold text-foreground truncate max-w-[300px]"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            {starredFiles.has(file.name) && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                          {file.isDir && (
                            <Badge variant="secondary" className="font-mono text-xs mt-1">
                              FOLDER
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {file.size}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                        <Clock className="w-3 h-3" />
                        {file.modTime}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-2 border-border">
                          {file.isDir ? (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleFileClick(file);
                            }}>
                              <FolderOpen className="w-4 h-4 mr-2" />
                              Open Folder
                            </DropdownMenuItem>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onPreview(file.name);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => downloadFile(file.name, e)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => toggleStar(file.name, e)}>
                            <Star className={cn(
                              "w-4 h-4 mr-2",
                              starredFiles.has(file.name) ? "fill-current text-yellow-500" : ""
                            )} />
                            {starredFiles.has(file.name) ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => deleteFile(file.name, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTable;