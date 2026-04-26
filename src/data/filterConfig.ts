export interface FilterField {
  key: string
  label: string
  options: string[]
  unit?: string        // unidad visual (GB, MHz, W...)
  icon?: string
}

export interface CatMeta {
  icon: string
  color: string        // color accent de la categoría
  description: string
}

export const CAT_META: Record<string, CatMeta> = {
  'Monitores':         { icon: '🖥️', color: '#3b82f6', description: 'Pantallas y displays' },
  'Case':              { icon: '🖨️', color: '#6b7280', description: 'Gabinetes y torres' },
  'PC Completa':       { icon: '💻', color: '#8b5cf6', description: 'Equipos completos' },
  'Disco SSD':         { icon: '💾', color: '#f59e0b', description: 'Almacenamiento rápido' },
  'Estabilizador':     { icon: '🔋', color: '#10b981', description: 'Reguladores de voltaje' },
  'Fuente de Poder':   { icon: '⚡', color: '#ef4444', description: 'PSU y fuentes ATX' },
  'Memoria RAM':       { icon: '🧩', color: '#06b6d4', description: 'Módulos de memoria' },
  'Periféricos':       { icon: '🖱️', color: '#84cc16', description: 'Mouse, teclado, etc.' },
  'Placa Madre':       { icon: '🔌', color: '#f97316', description: 'Motherboards' },
  'Tarjetas de Video': { icon: '🎮', color: '#a855f7', description: 'GPUs y tarjetas gráficas' },
}

export const TECH_FILTERS: Record<string, FilterField[]> = {
  'Disco SSD': [
    { key: 'capacity',    label: 'Capacidad',  icon: '📦', unit: '',    options: ['128GB','256GB','512GB','1TB','2TB','4TB'] },
    { key: 'storageType', label: 'Tipo',        icon: '🔗', unit: '',    options: ['SATA','NVMe','M.2 NVMe'] },
    { key: 'format',      label: 'Formato',     icon: '📐', unit: '',    options: ['2.5"','M.2','PCIe'] },
  ],
  'Memoria RAM': [
    { key: 'ramCapacity', label: 'Capacidad',   icon: '📦', unit: '',    options: ['4GB','8GB','16GB','32GB','64GB'] },
    { key: 'ramType',     label: 'Tipo',         icon: '🔗', unit: '',    options: ['DDR3','DDR4','DDR5'] },
    { key: 'frequency',   label: 'Frecuencia',   icon: '⚡', unit: 'MHz', options: ['2400MHz','2666MHz','3200MHz','3600MHz','4800MHz','6000MHz'] },
  ],
  'Placa Madre': [
    { key: 'socket',      label: 'Socket',       icon: '🔌', unit: '',    options: ['AM4','AM5','LGA1700','LGA1200','LGA1151'] },
    { key: 'chipset',     label: 'Chipset',      icon: '🧠', unit: '',    options: ['B450','B550','X570','B660','Z690','Z790','X670E'] },
    { key: 'formFactor',  label: 'Factor forma', icon: '📐', unit: '',    options: ['ATX','Micro-ATX','Mini-ITX'] },
  ],
  'Tarjetas de Video': [
    { key: 'vramSize',    label: 'VRAM',         icon: '📦', unit: '',    options: ['4GB','6GB','8GB','10GB','12GB','16GB','24GB'] },
    { key: 'gpuBrand',    label: 'GPU',          icon: '🎮', unit: '',    options: ['NVIDIA','AMD','Intel Arc'] },
    { key: 'connector',   label: 'Conector',     icon: '🔗', unit: '',    options: ['PCIe 4.0','PCIe 5.0','PCIe 3.0'] },
  ],
  'Fuente de Poder': [
    { key: 'wattage',       label: 'Potencia',      icon: '⚡', unit: 'W',  options: ['450W','500W','550W','650W','750W','850W','1000W'] },
    { key: 'certification', label: 'Certificación', icon: '🏅', unit: '',   options: ['80+ White','80+ Bronze','80+ Silver','80+ Gold','80+ Platinum','80+ Titanium'] },
  ],
  'Monitores': [
    { key: 'screenSize',  label: 'Tamaño',        icon: '📏', unit: '"',   options: ['21"','24"','27"','32"','34"','49"'] },
    { key: 'resolution',  label: 'Resolución',    icon: '🖼️', unit: '',    options: ['1080p','1440p','4K','Ultrawide'] },
    { key: 'refreshRate', label: 'Tasa refresco', icon: '🔄', unit: 'Hz',  options: ['60Hz','75Hz','144Hz','165Hz','240Hz','360Hz'] },
  ],
  'Periféricos': [
    { key: 'connector',   label: 'Conexión',      icon: '🔗', unit: '',    options: ['USB','Bluetooth','Inalámbrico 2.4GHz'] },
  ],
}

export const BRANDS: Record<string, string[]> = {
  'Monitores':         ['ASUS','LG','Samsung','AOC','BenQ','MSI','Gigabyte','ViewSonic'],
  'Case':              ['NZXT','Corsair','Fractal Design','Lian Li','Phanteks','Cooler Master','Thermaltake'],
  'PC Completa':       ['HP','Dell','Lenovo','ASUS','Acer','MSI'],
  'Disco SSD':         ['Samsung','WD','Seagate','Kingston','Crucial','Corsair','ADATA','Lexar'],
  'Estabilizador':     ['APC','Forza','Protek','Sola','Tripp Lite'],
  'Fuente de Poder':   ['Corsair','EVGA','Seasonic','Thermaltake','Cooler Master','NZXT','be quiet!'],
  'Memoria RAM':       ['Kingston','Corsair','G.Skill','Crucial','HyperX','ADATA','TeamGroup'],
  'Periféricos':       ['Logitech','Razer','Corsair','SteelSeries','HyperX','Redragon','A4Tech'],
  'Placa Madre':       ['ASUS','MSI','Gigabyte','ASRock','EVGA'],
  'Tarjetas de Video': ['ASUS','MSI','Gigabyte','EVGA','Zotac','Sapphire','PowerColor','XFX'],
}
