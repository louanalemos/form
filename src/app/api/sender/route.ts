import nodemailer from 'nodemailer';

interface Transport {
  host: string
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const anexo: File | null = formData.get('anexo') as unknown as File;
  const name = formData.get('name');
  const email = formData.get('email');
  const subject = formData.get('subject');

  const bytes = await anexo.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    host: 'smtp-mail.outlook.com',
    port: 465,
    auth: {
      user: process.env.TRANSPORTER_USER,
      pass: process.env.TRANSPORTER_PASS,
    },
  } as Transport);

  const output = `
      <h1>Oi, ${name}. Você se enviou um pdf.</h1>
    `
  try {
    await transporter.sendMail({
      from: process.env.MAIL_OPTIONS,
      to: `${email}`,
      subject: `Form: ${subject}`,
      html: output,
      attachments: [
        {
          filename: anexo.name,
          content: buffer,
        },
      ],
    });
    return Response.json({ message: 'Enviar e-mail.' })
  } catch (error) {
    console.log('Erro:', error)
    return Response.json({ message: 'Erro ao enviar o e-mail.' })
  }
}