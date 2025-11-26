import React from 'react';
// Asegúrate de importar tus componentes e iconos
import { DeviceCard } from '../ui/deviceCard';  // Ajusta la ruta si es necesario
import { MdOutlineSdStorage } from 'react-icons/md';
import { AiOutlineUsb } from 'react-icons/ai';

// Define el número total de puertos que siempre deben mostrarse
const TOTAL_PORTS = 4; 

/**
 * Componente encargado de renderizar una lista fija de 4 tarjetas de dispositivos/puertos.
 * Renderiza los dispositivos conectados y rellena el resto con placeholders "inactiva".
 *
 * @param {object} devices - El objeto de dispositivos (ej: { "sda1": {...}, "sdb1": {...} })
 */
const DeviceCardGroups = ({ devices }) => {
    
    // 1. Preparar los datos
    // Usa un objeto vacío si 'devices' es null o undefined para evitar errores.
    const deviceEntries = Object.entries(devices || {});
    
    // 2. Renderizar Dispositivos Conectados
    const connectedDeviceCards = deviceEntries.map(([deviceId, deviceData]) => {
        
        // --- Lógica de procesamiento de datos ---
        
        // Determinar el Ícono (USB o SD)
        const isSD = deviceData.mount_point?.toLowerCase().includes("sd") || false; 
        const icon = isSD ? <MdOutlineSdStorage className="h-10 w-10" /> : <AiOutlineUsb className="h-10 w-10" />;

        // Determinar el Nombre y la Descripción de Ubicación (solución al error de objeto)
        const deviceName = deviceData.valid ? deviceData.config?.name || deviceId : deviceId;
        const locationDescription = deviceData.valid 
            ? deviceData.config?.location?.description 
            : undefined; 

        // Determinar el Estado
        let status;
        if (deviceData.valid === false) {
            status = "error"; 
        } else if (deviceData.connected === true) {
            status = "montada"; 
        } else {
            status = "inactiva"; 
        }

        // --- Renderizado de la tarjeta de dispositivo conectado ---
        return (
            <DeviceCard
                key={deviceId} // Clave única para la tarjeta
                icon={icon}
                device_id='TCAM-001' 
                device_name='Cámara trampa 1' 
                location='Cúmulo 1' // Propiedad de tipo string (descripción)
                status={status}
                sd_detectada={deviceData.connected}
                valid={deviceData.valid}
            />
        );
    });

    // 3. Calcular y Renderizar Placeholders
    const portsToFill = TOTAL_PORTS - connectedDeviceCards.length;

    // Crea un array con el número de placeholders necesarios y los mapea
    const placeholderCards = Array.from({ length: portsToFill }, (_, index) => (
        <DeviceCard 
            icon={<MdOutlineSdStorage className="h-10 w-10" />}
            status="inactiva"
            // Clave única para los placeholders
            key={`placeholder-${index}`}
        />
    ));

    // 4. Devolver la lista completa de tarjetas (conectadas + placeholders)
    return (
        <div className="flex gap-2 flex-1"> {/* Puedes usar un div o un Fragment si no necesitas un contenedor */}
            {connectedDeviceCards}
            {placeholderCards}
        </div>
    );
};

export default DeviceCardGroups;