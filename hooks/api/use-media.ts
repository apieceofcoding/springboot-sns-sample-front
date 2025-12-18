'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { mediaApi } from '@/lib/api/media'
import type { MediaType } from '@/lib/types'

export function useMediaUpload() {
  const initMutation = useMutation({
    mutationFn: mediaApi.initUpload,
  })

  const confirmMutation = useMutation({
    mutationFn: mediaApi.uploadComplete,
  })

  const uploadMedia = async (file: File): Promise<number> => {
    try {
      // 1. Init upload - get presigned URL
      const mediaType: MediaType = file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO'
      const initResult = await initMutation.mutateAsync({
        mediaType,
        fileSize: file.size,
      })

      // 2. Upload to S3 using presigned URL
      if (initResult.presignedUrl) {
        await fetch(initResult.presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })
      }

      // 3. Confirm upload
      await confirmMutation.mutateAsync({
        mediaId: initResult.id,
        parts: [], // For multipart uploads if needed
      })

      return initResult.id
    } catch (error) {
      toast.error('미디어 업로드 실패')
      console.error('Media upload error:', error)
      throw error
    }
  }

  return {
    uploadMedia,
    isUploading: initMutation.isPending || confirmMutation.isPending,
  }
}
