"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

const mimeTypes = ["image/jpeg", "image/png", "image/webp"] as const
type ImageMimeType = (typeof mimeTypes)[number]

export type ImageUploadPurpose =
  | "profile"
  | "project"
  | "certification-thumbnail"
  | "blog-cover"
  | "blog-content"

export type UploadedImage = {
  assetId: string
  imageUrl: string
  width: number
  height: number
  mimeType: ImageMimeType
  fileSize: number
}

type Props = {
  purpose: ImageUploadPurpose
  value: UploadedImage | null
  onChange: (image: UploadedImage | null) => void
  label?: string
  maxBytes?: number
}

type UploadState =
  | { status: "uploading"; preview: string; progress: number | null }
  | { status: "success" }
  | { status: "error"; message: string }

function isImageMimeType(value: unknown): value is ImageMimeType {
  return mimeTypes.some((type) => value === type)
}

function isUploadedImage(value: unknown): value is UploadedImage {
  if (!value || typeof value !== "object") return false
  const image = value as Partial<UploadedImage>
  return (
    typeof image.assetId === "string" &&
    /^[a-f\d]{24}$/.test(image.assetId) &&
    typeof image.imageUrl === "string" &&
    /^https:\/\/i\.ibb\.co\/[\w-]+\/[\w.-]+$/.test(image.imageUrl) &&
    isImageMimeType(image.mimeType) &&
    [image.width, image.height, image.fileSize].every(
      (number) =>
        typeof number === "number" && Number.isSafeInteger(number) && number > 0
    )
  )
}

function uploadError(status: number) {
  switch (status) {
    case 401:
      return "Sign in again to upload an image."
    case 403:
      return "You do not have permission to upload an image."
    case 408:
    case 504:
      return "The upload timed out. Try again."
    case 413:
      return "The image exceeds the server’s size limit. Choose a smaller file."
    case 415:
      return "Choose a JPEG, PNG, or WebP image."
    case 422:
      return "Choose a valid still image within 6000 × 6000 pixels and 20 megapixels."
    case 502:
    case 503:
      return "Image uploads are temporarily unavailable. Try again later."
    default:
      return "The image could not be uploaded. Try again."
  }
}

export function AdminImageUploader({
  purpose,
  value,
  onChange,
  label = "Image",
  maxBytes = 5 * 1024 * 1024,
}: Props) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const activeUpload = useRef<XMLHttpRequest | null>(null)
  const [state, setState] = useState<UploadState | null>(null)
  const uploading = state?.status === "uploading" ? state : null
  const localPreview = uploading?.preview
  const preview = localPreview ?? value?.imageUrl

  useEffect(() => {
    return () => {
      const request = activeUpload.current
      activeUpload.current = null
      request?.abort()
    }
  }, [])

  useEffect(
    () => () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    },
    [localPreview]
  )

  function selectImage(file: File) {
    if (activeUpload.current) return
    if (!isImageMimeType(file.type)) {
      setState({ status: "error", message: uploadError(415) })
      return
    }
    if (file.size > maxBytes) {
      setState({ status: "error", message: uploadError(413) })
      return
    }

    const request = new XMLHttpRequest()
    activeUpload.current = request
    setState({
      status: "uploading",
      preview: URL.createObjectURL(file),
      progress: null,
    })
    const form = new FormData()
    form.set("image", file)
    form.set("purpose", purpose)

    function fail(status: number) {
      if (activeUpload.current !== request) return
      activeUpload.current = null
      setState({ status: "error", message: uploadError(status) })
    }

    request.open("POST", "/api/admin/media/images")
    request.responseType = "json"
    request.timeout = 40_000
    request.upload.onprogress = (event) => {
      if (activeUpload.current !== request || !event.lengthComputable) return
      setState((current) =>
        current?.status === "uploading"
          ? {
              ...current,
              progress: Math.floor((event.loaded * 100) / event.total),
            }
          : current
      )
    }
    request.onload = () => {
      if (activeUpload.current !== request) return
      const result: unknown = request.response
      if (request.status !== 201 || !isUploadedImage(result)) {
        fail(request.status)
        return
      }
      activeUpload.current = null
      setState({ status: "success" })
      onChange(result)
    }
    request.onerror = () => fail(0)
    request.ontimeout = () => fail(408)
    request.send(form)
  }

  function removeImage() {
    const request = activeUpload.current
    activeUpload.current = null
    request?.abort()
    setState(null)
    if (!request && value) onChange(null)
  }

  return (
    <fieldset
      className="min-w-0 space-y-3 rounded-lg border p-4"
      aria-describedby={`${id}-help`}
    >
      <legend className="px-1 text-sm font-medium">{label}</legend>
      <p id={`${id}-help`} className="text-sm text-muted-foreground">
        Still JPEG, PNG, or WebP. Up to{" "}
        {new Intl.NumberFormat(undefined, {
          style: "unit",
          unit: maxBytes < 1024 * 1024 ? "kilobyte" : "megabyte",
          maximumFractionDigits: 2,
        }).format(maxBytes / (maxBytes < 1024 * 1024 ? 1024 : 1024 * 1024))}
        .
      </p>
      {preview && (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-md bg-muted">
          <Image
            src={preview}
            alt={`${label} preview`}
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept={mimeTypes.join(",")}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ""
          if (file) selectImage(file)
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!!uploading}
          onClick={() => input.current?.click()}
        >
          {value ? "Replace image" : "Choose image"}
        </Button>
        {(value || uploading) && (
          <Button type="button" variant="ghost" onClick={removeImage}>
            {uploading ? "Cancel upload" : "Remove image"}
          </Button>
        )}
      </div>
      {uploading && (
        <progress
          aria-label="Image upload progress"
          max={100}
          value={uploading.progress ?? undefined}
          className="block h-2 w-full max-w-sm accent-primary"
        />
      )}
      <p role="status" className="text-sm text-muted-foreground empty:hidden">
        {uploading &&
          (uploading.progress === 100
            ? "Processing image…"
            : "Uploading image…")}
        {state?.status === "success" && value && "Image uploaded."}
      </p>
      {state?.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </fieldset>
  )
}
