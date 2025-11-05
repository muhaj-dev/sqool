import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Upload, FileText, Trash2, Download } from 'lucide-react'

interface QuestionsFileUploadProps {
  questionsFile: File | null
  setQuestionsFile: (file: File | null) => void
  isEditMode?: boolean
  currentFileName?: string
  onDownloadCurrent?: () => void
}

export const QuestionsFileUpload: React.FC<QuestionsFileUploadProps> = ({
  questionsFile,
  setQuestionsFile,
  isEditMode = false,
  currentFileName,
  onDownloadCurrent,
}) => {
  const { toast } = useToast()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.txt']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

      if (!allowedTypes.includes(fileExtension ?? '')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload PDF, DOC, DOCX, or TXT files only.',
          variant: 'destructive',
        })
        return
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload files smaller than 10MB.',
          variant: 'destructive',
        })
        return
      }

      setQuestionsFile(file)
      toast({
        title: 'Questions file uploaded',
        description: `${file.name} has been selected for upload.`,
      })
    }
  }

  const removeFile = () => {
    setQuestionsFile(null)
    toast({
      title: 'File removed',
      description: 'Questions file has been removed.',
    })
  }

  const handleDownloadCurrent = () => {
    if (onDownloadCurrent) {
      onDownloadCurrent()
    } else {
      // Default download behavior
      toast({
        title: 'Download started',
        description: `Downloading ${currentFileName}...`,
      })
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file) {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt']
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

        if (!allowedTypes.includes(fileExtension ?? '')) {
          toast({
            title: 'Invalid file type',
            description: 'Please upload PDF, DOC, DOCX, or TXT files only.',
            variant: 'destructive',
          })
          return
        }

        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: 'Please upload files smaller than 10MB.',
            variant: 'destructive',
          })
          return
        }

        setQuestionsFile(file)
        toast({
          title: 'Questions file uploaded',
          description: `${file.name} has been selected for upload.`,
        })
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2 text-base font-medium">
        <Upload className="h-4 w-4" />
        Questions File {isEditMode ? '(*)' : '(*)'}
        <span className="text-sm font-normal text-muted-foreground">PDF, DOC, DOCX, TXT • Max 10MB</span>
      </Label>

      {isEditMode && currentFileName && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <span className="text-sm font-medium block">Current file:</span>
              <span className="text-xs text-muted-foreground">{currentFileName}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCurrent}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      )}

      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onClick={() => document.getElementById('questions-upload')?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          {isEditMode
            ? 'Drop new questions file here or click to browse'
            : 'Drop questions file here or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground">
          {isEditMode
            ? 'Upload a new file to replace the current one'
            : 'Supported formats: PDF, DOC, DOCX, TXT • Max size: 10MB'}
        </p>
      </div>

      <Input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
        id="questions-upload"
      />

      {questionsFile && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <span className="text-sm font-medium block">{isEditMode ? 'New file:' : 'Selected file:'}</span>
              <span className="text-xs text-muted-foreground">
                {questionsFile.name} • {(questionsFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isEditMode && !questionsFile && (
        <p className="text-sm text-muted-foreground italic">Leave empty to keep the current questions file</p>
      )}
    </div>
  )
}
