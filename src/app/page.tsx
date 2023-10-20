import FormPDF from "@/components/Form";

export default function Home() {
  return (
   <div className="bg-pink-400 h-screen flex flex-col justify-center items-center gap-4 font-sans max-w-full min-w-max p-4">
    <h1 className="text-pink-950 font-semibold text-xl">Auto-envio de PDF</h1> <h6 className="text-xs font-extralight">(pq sim)</h6>

    < FormPDF />
   </div>
  )
}
