import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";


export default function Gallery({ open, onOpenChange, name, type, state, container, inferences, accuracy, images }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  type?: string;
  state?: string;
  container?: string;
  inferences?: number;
  accuracy?: string;
  images?: { id: number; title: string; image: string }[];
}) {
  

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
          <AlertDialogTitle>{name}</AlertDialogTitle>
          <AlertDialogDescription>
            {type && <p>Tipo: {type}</p>}
            {state && <p>Estado: {state}</p>}
            {container && <p>Contenedor: {container}</p>}
            {inferences !== undefined && <p>Inferencias realizadas: {inferences}</p>}
            {accuracy && <p>Precisión: {accuracy}</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* GALERÍA */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {images?.map((image) => (
            <div
              key={image.id}
              /* HIJO: Solo definimos altura y estilos visuales, el ancho es automático */
              className="h-[180px] rounded-lg relative overflow-hidden group cursor-pointer"
            >
              {/* IMAGEN */}
              <img
                src={image.image}
                alt={""}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* DEGRADADO */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* TEXTO */}
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <span className="text-white font-semibold text-lg tracking-wide">
                  {image.title}
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
