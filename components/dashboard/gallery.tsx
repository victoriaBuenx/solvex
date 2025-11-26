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
        "https://images.unsplash.com/photo-1551096066-87d903f5ce62?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Águila Real",
      image:
        "https://images.unsplash.com/photo-1698655191023-745a50785311?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Colibrí",
      image:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Tucán",
      image:
        "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 5,
      title: "Búho Nival",
      image:
        "https://images.unsplash.com/photo-1576408139360-3162b78b879c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 6,
      title: "Flamenco",
      image:
        "https://images.unsplash.com/photo-1550953372-e565b9e072c4?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 7,
      title: "Pavo Real",
      image:
        "https://images.unsplash.com/photo-1505832018823-50331d70d237?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 8,
      title: "Pingüino Real",
      image:
        "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 9,
      title: "Cardenal",
      image:
        "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=400&q=80",
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
