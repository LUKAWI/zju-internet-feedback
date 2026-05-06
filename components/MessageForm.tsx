'use client'

import { useState, useEffect } from 'react'
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createMessageSchema, type CreateMessageInput } from '@/lib/validations'

interface MessageFormProps {
  onSubmit: (data: CreateMessageInput) => Promise<void>
}

interface FormFieldsProps {
  register: UseFormRegister<CreateMessageInput>
  errors: FieldErrors<CreateMessageInput>
  isSubmitting: boolean
  isMobile: boolean
}

function FormFields({ register, errors, isSubmitting, isMobile }: FormFieldsProps) {
  return (
    <div className="space-y-5">
      <div>
        <input
          placeholder="你的昵称"
          className={`underline-input w-full ${errors.nickname ? 'error-input' : ''}`}
          {...register('nickname')}
        />
        {errors.nickname && (
          <p className="mt-1 text-xs text-red-500">{errors.nickname.message}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="分享你对校园网的看法..."
          rows={isMobile ? 2 : 3}
          className={`underline-input w-full resize-none ${errors.content ? 'error-input' : ''}`}
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="text-link-btn inline-flex items-center gap-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          发送
        </button>
      </div>
    </div>
  )
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = matchMedia('(max-width: 640px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      nickname: '',
      content: '',
    },
  })

  const handleFormSubmit = async (data: CreateMessageInput) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      reset()
      toast.success('留言成功', {
        description: '你的留言已发布',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : '请稍后重试'
      toast.error('留言失败', {
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isMobile) {
    return (
      <div className="mobile-sticky-form">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            isMobile={isMobile}
          />
        </form>
      </div>
    )
  }

  return (
    <section className="py-10 sm:py-12">
      <h3 className="section-heading mb-6">发表看法</h3>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormFields
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          isMobile={isMobile}
        />
      </form>
    </section>
  )
}
