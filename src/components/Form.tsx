'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Campo obrigatório.' }),
  email: z
    .string()
    .email({ message: 'E-mail inválido.' }),
  subject: z
    .string()
    .min(3, { message: 'Campo obrigatório.' }),
  anexo: z
    .custom<FileList>((list) => list instanceof FileList)
    .refine((file) => file?.length > 0, 'Escolha um arquivo.')
    .transform((file) => file[0]),
});

type newFormSchema = z.infer<typeof formSchema>

export default function FormPDF() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<newFormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function newWorkWithUs(data: newFormSchema) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('anexo', data.anexo);

      // oi, dev. se quiser conferir se o anexo esta sendo reconhecido,
      // descomente a linha abaixo. (tchau, da Lou)      
      // console.log(data.anexo);

      await axios.post('/api/sender', formData);

      alert('Anexo enviado com sucesso! Confira seu e-mail.')
      reset()
    } catch (error) {
      console.error(error)      
      alert(
        'Não foi possivel enviar seu anexo, por favor tente novamente mais tarde.',
      )
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="workwithus" title="Trabalhe Conosco" className='lg:w-1/2'>
      <form
        id="form"
        onSubmit={handleSubmit(newWorkWithUs)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex w-full flex-col gap-1">
          <label className='font-semibold text-base'>Seu Nome *</label>
          <input type="text" id="name" {...register('name')} className='p-2 rounded-md' />
          <div className="text-xs font-light text-red-700">
            {errors.name && <span>{errors.name.message}</span>}
          </div>          
        </div>

        <div className="flex flex-col md:flex md:flex-row gap-4">
          <div className="flex flex-col lg:w-1/2 gap-1">
            <label className='font-semibold text-base'>Seu E-mail *</label>
            <input type="text" id="email" {...register('email')} className='p-2 rounded-md' />
            <span className="text-xs font-light text-red-700">
              {errors.email?.message && <span>{errors.email.message}</span>}
            </span>  
          </div>

          <div className='flex flex-col lg:w-1/2 gap-1'>
            <label className='font-semibold text-base'>Assunto *</label>
            <input type="text" id="phone" {...register('subject')} className='p-2 rounded-md' />
            <span className="text-xs font-light text-red-700">
              {errors.subject?.message && <span>{errors.subject.message}</span>}
            </span>  
          </div>
        </div>
                  
        <div className='flex w-full max-sm:w-1/2 flex-col gap-1'>
          <label className='font-semibold text-base'>Seu PDF *</label>
          <input type="file" accept="application/pdf"
              {...register('anexo')} />
          <span className="text-xs font-light text-red-700">
            {errors.anexo?.message && <span>{errors.anexo.message}</span>}
          </span>
        </div>       
        
        <span className='text-xs'>(*) campos obrigatórios</span>
        <button form="form" type="submit" className={`w-max px-6 py-4 bg-pink-700 hover:bg-opacity-60 text-primary rounded-full uppercase tracking-widest text-base font-semibold 
            ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:bg-opacity-95' }`} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Envie sua mensagem'}
        </button>         
      </form>
    </section>
  )
}