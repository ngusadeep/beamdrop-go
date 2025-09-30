import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileText,
  Code,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getFileIcon } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

interface FilePreviewProps {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export function FilePreview({ fileName, isOpen, onClose, currentPath = "." }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
  
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(fileExt);
  const isPdf = fileExt === "pdf";
  const isVideo = ["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(fileExt);
  const isAudio = ["mp3", "wav", "ogg", "flac", "aac"].includes(fileExt);
  const isText = ["txt", "md", "json", "xml", "csv", "log"].includes(fileExt);
  const isCode = ["js", "ts", "tsx", "jsx", "py", "java", "vint", "go", "php", "rb", "html", "css", "scss"].includes(fileExt);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setZoom(100);
    }
  }, [isOpen, fileName]);

  const handleDownload = () => {
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

  const renderPreviewContent = () => {
    const filePath = currentPath === "." ? fileName : `${currentPath}/${fileName}`;
    const previewUrl = `/files?path=${encodeURIComponent(filePath)}`;

    if (isImage) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              disabled={zoom <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Badge variant="secondary" className="font-mono text-xs">
              {zoom}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <img
              src={previewUrl}
              alt={fileName}
              style={{ transform: `scale(${zoom / 100})` }}
              className="max-w-full h-auto transition-transform origin-center"
              onLoad={() => setLoading(false)}
              onError={() => {
                setError("Failed to load image");
                setLoading(false);
              }}
            />
          </div>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div className="w-full h-[70vh]">
          <iframe
            src={previewUrl}
            className="w-full h-full border border-border rounded"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError("Failed to load PDF");
              setLoading(false);
            }}
            title={`PDF preview of ${fileName}`}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="w-full">
          <video
            src={previewUrl}
            controls
            className="w-full max-h-[60vh] bg-black rounded"
            onLoadedData={() => setLoading(false)}
            onError={() => {
              setError("Failed to load video");
              setLoading(false);
            }}
            onLoadStart={() => setLoading(true)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="w-full space-y-4">
          <div className="bg-secondary p-6 rounded border-2 border-border text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="font-mono font-bold text-foreground mb-2">{fileName}</p>
            <Badge variant="outline" className="font-mono text-xs">
              AUDIO FILE
            </Badge>
          </div>
          <audio
            src={previewUrl}
            controls
            className="w-full"
            onLoadedData={() => setLoading(false)}
            onError={() => {
              setError("Failed to load audio");
              setLoading(false);
            }}
            onLoadStart={() => setLoading(true)}
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    if (isText || isCode) {
      return (
        <div className="w-full">
          <TextFilePreview 
            fileName={fileName} 
            currentPath={currentPath}
            onLoad={() => setLoading(false)} 
            onError={(err) => {
              setError(err);
              setLoading(false);
            }} 
          />
        </div>
      );
    }

    // Unsupported file type
    setTimeout(() => setLoading(false), 0);
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-mono font-bold text-foreground mb-2">
          PREVIEW NOT AVAILABLE
        </h3>
        <p className="text-muted-foreground font-mono text-sm mb-4">
          This file type cannot be previewed in the browser
        </p>
        <Button onClick={handleDownload} variant="default">
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-2 border-border">
        <DialogHeader>
          <div className="flex items-center justify-between m-4">
            <DialogTitle className="font-mono font-bold text-foreground truncate">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {loading && !error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
                <p className="font-mono text-sm text-muted-foreground">
                  LOADING PREVIEW...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="font-mono font-bold text-foreground mb-2">
                PREVIEW ERROR
              </h3>
              <p className="text-muted-foreground font-mono text-sm mb-4">
                {error}
              </p>
              <Button onClick={handleDownload} variant="default">
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          )}

          {!error && (
            <div style={{ display: loading ? 'none' : 'block' }}>
              {renderPreviewContent()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Language mapping for syntax highlighting
function getLanguageFromExtension(ext: string): string {
  const languageMap: { [key: string]: string } = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'py': 'python',
    'java': 'java',
    'go': 'go',
    'php': 'php',
    'rb': 'ruby',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'json': 'json',
    'xml': 'xml',
    'yml': 'yaml',
    'yaml': 'yaml',
    'md': 'markdown',
    'sh': 'bash',
    'bash': 'bash',
    'c': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'h': 'c',
    'hpp': 'cpp',
    'rs': 'rust',
    'vue': 'vue',
    'swift': 'swift',
    'kt': 'kotlin',
    'kts': 'kotlin',
    'sql': 'sql',
    'dockerfile': 'dockerfile',
  };

  return languageMap[ext] || 'text';
}

// Component for text file previews
function TextFilePreview({ fileName, currentPath = ".", onLoad, onError }: {
  fileName: string;
  currentPath?: string;
  onLoad: () => void;
  onError: (error: string) => void;
}) {
  const [content, setContent] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const filePath = currentPath === "." ? fileName : `${currentPath}/${fileName}`;
        const response = await fetch(`/files?path=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch file content");
        }
        const text = await response.text();
        setContent(text);
        onLoad();
      } catch (error) {
        onError("Failed to load text file");
      }
    };

    fetchContent();
  }, [fileName, currentPath, onLoad, onError]);

  const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
  const isCode = ["js", "ts", "tsx", "jsx", "py", "java", "go", "php", "rb", "html", "css", "scss", "json", "xml", "yml", "yaml", "md", "sh", "bash", "c", "cpp", "cc", "cxx", "h", "hpp", "rs", "vue", "swift", "kt", "kts", "sql", "dockerfile"].includes(fileExt);
  
  // Get the appropriate icon from the getFileIcon function
  const fileIcon = getFileIcon(fileName);
  
  // Determine the current effective theme
  const currentTheme = theme === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  const syntaxTheme = currentTheme === "dark" ? oneDark : oneLight;
  const language = getLanguageFromExtension(fileExt);

  return (
    <div className="bg-secondary border-2 border-border rounded p-4">
      <div className="flex items-center gap-2 mb-4">
        {/* Use the specific file icon instead of generic Code icon */}
        <div className="flex items-center justify-center w-4 h-4">
          {fileIcon}
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {fileExt.toUpperCase()}
        </Badge>
        {isCode && (
          <Badge variant="secondary" className="font-mono text-xs">
            {language.toUpperCase()}
          </Badge>
        )}
      </div>
      <div className="bg-background border border-border rounded overflow-hidden">
        {isCode ? (
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            customStyle={{
              margin: 0,
              padding: '16px',
              fontSize: '14px',
              maxHeight: '50vh',
              backgroundColor: 'transparent',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'inherit',
              }
            }}
            wrapLines={true}
            wrapLongLines={true}
            showLineNumbers={content.split('\n').length > 1}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: currentTheme === 'dark' ? '#6b7280' : '#9ca3af',
              borderRight: `1px solid ${currentTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
            }}
          >
            {content}
          </SyntaxHighlighter>
        ) : (
          <div className="p-4 max-h-[50vh] overflow-auto scrollbar-thin">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}