export type Language = 'th' | 'en';

export const i18n = {
  th: {
    appTitle: "GlobePass",
    appSubtitle: "ระบบตรวจสอบข้อกำหนดวีซ่าและคู่มือยื่นคำร้องกงสุลทั่วโลก",
    tagline: "ตรวจสอบสิทธิ์พำนัก เอกสารที่ต้องใช้ และขั้นตอนยื่นวีซ่า 199 ประเทศ 39,601 คู่ความสัมพันธ์ทางการทูต",
    fromLabel: "ประเทศผู้ถือพาสปอร์ต (Origin)",
    toLabel: "ประเทศปลายทาง (Destination)",
    selectFromPlaceholder: "เลือกประเทศผู้ถือหนังสือเดินทาง...",
    selectToPlaceholder: "เลือกประเทศปลายทาง...",
    searchCountry: "พิมพ์ชื่อประเทศหรือรหัส (เช่น ไทย, TH, Japan, JP)...",
    noCountryFound: "ไม่พบประเทศที่ค้นหา",
    checkBtn: "ตรวจสอบข้อกำหนดทางการ",
    checkingBtn: "ระบบ AI กำลังประมวลผล...",
    swapTooltip: "สลับประเทศต้นทางและปลายทาง",
    quickStatusLabel: "ข้อกำหนดเบื้องต้นตาม Passport Index:",
    
    // Tabs for compact instrument register
    tabOverview: "ภาพรวมและข้อกำหนด",
    tabChecklist: "เอกสารที่ต้องเตรียม",
    tabTimeline: "ขั้นตอนดำเนินการ",
    tabPortal: "พอร์ทัลทางการ",

    // Result sections
    resultTitle: "ผลการวิเคราะห์ข้อกำหนดวีซ่าอย่างเป็นทางการ",
    liveAiBadge: "ประมวลผลแบบเรียลไทม์",
    cachedBadge: "บันทึกในฐานข้อมูลกงสุล",
    stayDurationLabel: "ระยะเวลาพำนักที่อนุญาต",
    processingTimeLabel: "ระยะเวลาพิจารณาคำร้อง",
    estimatedCostLabel: "ประมาณการค่าธรรมเนียมกงสุล",
    
    summaryTitle: "บันทึกสรุปข้อกำหนดคนเข้าเมือง",
    summaryNotice: "สังเคราะห์ตามนโยบายคนเข้าเมืองและข้อบังคับสถานเอกอัครราชทูตอย่างเป็นทางการ",
    
    checklistTitle: "รายการเอกสารจำเป็นสำหรับการเดินทาง",
    checklistSubtitle: "ตรวจสอบและติ๊กบันทึกรายการเอกสารที่คุณจัดเตรียมเรียบร้อยแล้ว",
    checklistProgress: "จัดเตรียมแล้ว",
    of: "จากทั้งหมด",
    allCompleted: "จัดเตรียมเอกสารครบถ้วนแล้ว พร้อมสำหรับการยื่นคำร้องต่อสถานทูตหรือด่านตรวจคนเข้าเมือง",
    
    timelineTitle: "ขั้นตอนและแผนงานการยื่นคำร้อง",
    timelineSubtitle: "ปฏิบัติตามลำดับขั้นตอนตั้งแต่วันเตรียมเอกสารจนถึงวันเดินทาง",
    
    officialPortalTitle: "พอร์ทัลทางการของรัฐบาลและสถานทูต",
    officialPortalDesc: "เข้าสู่เว็บไซต์อย่างเป็นทางการของสถานเอกอัครราชทูตหรือระบบคนเข้าเมืองแห่งชาติเพื่อยื่นคำร้อง",
    openPortalBtn: "เปิดพอร์ทัลทางการของรัฐบาล",
    officialWarning: "คำเตือน: โปรดยื่นคำร้องผ่านเว็บไซต์ทางการของรัฐบาลเท่านั้น ระวังเว็บไซต์ตัวแทนที่คิดค่าบริการส่วนต่างเกินจริง",
    
    // Status text
    visa_free: "ไม่ต้องขอวีซ่า (Visa Free)",
    visa_on_arrival: "ขอวีซ่า ณ ด่านตรวจคนเข้าเมือง (VoA)",
    evisa: "ยื่นขอวีซ่าอิเล็กทรอนิกส์ (eVisa / ETA)",
    embassy_visa: "ต้องยื่นขอวีซ่าผ่านสถานทูต (Embassy Visa)",
    domestic: "การเดินทางภายในประเทศ",
    no_admission: "ไม่อนุญาตให้เดินทางเข้าประเทศ",
    
    // Proof and Popular
    popularSectionTitle: "จุดหมายปลายทางยอดนิยม",
    popularSectionSubtitle: "ประเทศต่างๆ ในนี้ถูกลิสต์มาแล้วว่ายอดนิยม แตะเลือกเพื่อตรวจสอบข้อกำหนดและขั้นตอนทันที",
    popularDestinations: "ปลายทางยอดนิยม:",
    clearSelection: "ล้างการเลือก",
    backendConnected: "ระบบกงสุลออนไลน์",
    backendOffline: "โหมดสแตนด์อโลน",
    proofBanner: "ข้อมูลถูกต้องตามระเบียบกงสุลสากล ตรวจสอบจากฐานข้อมูล Passport Index",
    proofNotice: "ข้อมูลอาจไม่อัปเดตตามปัจจุบัน โปรดตรวจสอบข้อมูลจากเว็บไซต์ทางการของประเทศที่จะไปด้วย เมื่อใช้งานฟังก์ชัน AI ตรวจสอบข้อกำหนด ระบบจะแสดงลิงก์เว็บไซต์กงสุลทางการของประเทศนั้นๆ"
  },
  en: {
    appTitle: "GlobePass",
    appSubtitle: "Global Visa Protocols & Consular Application Intelligence",
    tagline: "Instant entry allowances, required document checklists, and step-by-step procedures for 199 countries across 39,601 diplomatic pairs.",
    fromLabel: "Passport Country (Origin)",
    toLabel: "Destination Country",
    selectFromPlaceholder: "Select your passport nationality...",
    selectToPlaceholder: "Select arrival destination...",
    searchCountry: "Search by country name or code (e.g. Thailand, TH, Japan)...",
    noCountryFound: "No matching country found",
    checkBtn: "Check Official Requirements",
    checkingBtn: "Synthesizing Policies...",
    swapTooltip: "Swap origin and destination",
    quickStatusLabel: "Passport Index Baseline Policy:",
    
    // Tabs for compact instrument register
    tabOverview: "Overview & Allowance",
    tabChecklist: "Document Checklist",
    tabTimeline: "Application Roadmap",
    tabPortal: "Official Portal",

    // Result sections
    resultTitle: "Consular Visa Policy Assessment",
    liveAiBadge: "Live Consular Intelligence",
    cachedBadge: "Verified Database Record",
    stayDurationLabel: "Permitted Stay Duration",
    processingTimeLabel: "Standard Processing Time",
    estimatedCostLabel: "Estimated Consular Fee",
    
    summaryTitle: "Official Consular Policy Summary",
    summaryNotice: "Cross-referenced against verified national immigration authority and embassy regulations.",
    
    checklistTitle: "Mandatory Travel Documentation Checklist",
    checklistSubtitle: "Check off credentials you have already compiled for submission",
    checklistProgress: "Prepared",
    of: "of",
    allCompleted: "All mandatory credentials prepared. Ready for consular submission or border presentation.",
    
    timelineTitle: "Sequential Application Roadmap",
    timelineSubtitle: "Execute milestones in order from document authentication to visa clearance",
    
    officialPortalTitle: "Verified Government & Embassy Portal",
    officialPortalDesc: "Direct access to official national immigration or diplomatic portal",
    openPortalBtn: "Open Official Government Portal",
    officialWarning: "Notice: Always submit applications through verified national government channels. Beware of unaccredited third-party brokers charging unauthorized fees.",
    
    // Status text
    visa_free: "Visa Free Access",
    visa_on_arrival: "Visa on Arrival (VoA)",
    evisa: "Electronic Visa (eVisa / ETA)",
    embassy_visa: "Embassy Visa Required",
    domestic: "Domestic Passage",
    no_admission: "No Entry Permitted",
    
    // Proof and Popular
    popularSectionTitle: "Popular Destinations",
    popularSectionSubtitle: "Curated popular destinations. Tap any country to inspect official entry requirements.",
    popularDestinations: "Popular routes:",
    clearSelection: "Clear selection",
    backendConnected: "Consular Engine Online",
    backendOffline: "Standalone Offline Mode",
    proofBanner: "Verified across 39,601 country pairs against international consular regulations and the",
    proofNotice: "Information may not reflect real-time updates. Please verify official requirements with the destination country. Running the AI verification will display the official consular website link for that country."
  }
};
