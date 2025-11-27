import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export default function Gallery({ open, onOpenChange, title }: any) {
  const birds = [
    {
      id: 1,
      title: "Guacamaya Roja",
      // Foto vibrante de Zdeněk Macháček
      image:
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/fbb5daa3-ee95-4fb4-a4c8-925ed36bc793/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=8bfe862bc3b68e12e4e5a11e650ae65ca3d18fa0d13378f7954ce8787a3a4695",
    },
    {
      id: 2,
      title: "Águila Real",
      image:
        "https://imagenes.elpais.com/resizer/v2/2CY4RIANFBBAHCSBEPZVNZ5BG4.JPG?auth=2b2630b9e69bd538c70724515c85ded5d3b1b258ea5a69c0332c9390d1939211&width=414",
    },
    {
      id: 3,
      title: "Colibrí",
      image:
        "https://elements-resized.envatousercontent.com/elements-video-cover-images/d50d9581-6f62-4f05-ad11-721a949185f7/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=8575049fb216e16876db705e46a7e3c3c14cce28e67dd42f80e16c049c616da7",
    },
    {
      id: 4,
      title: "Tucán",
      image:
        "https://www.lavanguardia.com/files/image_990_484/uploads/2014/08/06/5f9c1a60be34b.jpeg",
    },
    {
      id: 5,
      title: "Búho Nival",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgriXiA-CZRKYD1agB3SFEqJUWbATWtEuuogfDxhAyDJZvz_0aD9OAA54o92Ve2T2Ichl83EGFUzPtlGk5ML6ul1i4gGxVbi5bSsE7KlZ4yULj_Sic-7f-olbUVpLTAa0n6-fCrstnGb08/s2100/B%25C3%25BAho+nival+14.jpg ",
    },
    {
      id: 6,
      title: "Flamenco",
      image:
        "https://www.excelsior.com.mx/770x530/filters:format(webp):quality(75)/media/pictures/2024/11/25/3218106.jpg",
    },
    {
      id: 7,
      title: "Pavo Real",
      image:
        "https://www.pavorealpedia.com/wp-content/uploads/2016/04/pavo-real-1.jpg",
    },
    {
      id: 8,
      title: "Pingüino Real",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRryUxvhhuAPrjwCS5D3da4-rxyNv2hc0DCvA&s",
    },
    {
      id: 9,
      title: "Cardenal",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWqYQznlRQzueVDvVhNXWqAMkg2AKbczHlnX36wgP7wN2ORtvapMkpSSQrnDIwLaLcU24&usqp=CAU",
    },
  ];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
            !max-w-none          /* permite ancho personalizado */
            !w-[95vw]            /* ancho por defecto (móvil) */
            !h-[90vh]            /* altura por defecto */
            
            md:!w-[85vw]         /* tablets */
            lg:!w-[70vw]         /* desktop */
            xl:!w-[60vw]         /* monitores grandes */

            overflow-y-auto
            rounded-xl
            p-6
        "
      >
        {/* BOTÓN DE CERRAR */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-sm opacity-70 hover:opacity-100"
        >
          ✕
        </button>

        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Galería relacionada con la opción seleccionada.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* GALERÍA */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {birds.map((bird) => (
            <div
              key={bird.id}
              /* HIJO: Solo definimos altura y estilos visuales, el ancho es automático */
              className="h-[180px] rounded-lg relative overflow-hidden group cursor-pointer"
            >
              {/* IMAGEN */}
              <img
                src={bird.image}
                alt={""}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* DEGRADADO */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* TEXTO */}
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <span className="text-white font-semibold text-lg tracking-wide">
                  {bird.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        <AlertDialogFooter />
      </AlertDialogContent>
    </AlertDialog>
  );
}
