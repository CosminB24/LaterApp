import emailjs from '@emailjs/browser';

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: to,
        subject: subject,
        message: text,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 