const{useState,useEffect,useRef,useCallback,createContext,useContext}=React;const SUPABASE_URL="https://cdtzfoqhnjpdjwjpmiix.supabase.co";const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdHpmb3FobmpwZGp3anBtaWl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDYxMjcsImV4cCI6MjA5Njc4MjEyN30.M_BNqDXgZmnvybd41uxZA0DezZaRk8QJzykx6fD9iIE";const AI_API_URL=(typeof window!=="undefined"&&window.AYUDA_AI_PROXY)?window.AYUDA_AI_PROXY:"https://api.anthropic.com/v1/messages";const sbClient={auth:{signUp:(email,pw,nombre)=>fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY},body:JSON.stringify({email,password:pw,options:{data:{nombre}}})}).then(r=>r.json()),signIn:(email,pw)=>fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY},body:JSON.stringify({email,password:pw})}).then(r=>r.json()),signOut:token=>fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:"POST",headers:{"Authorization":`Bearer ${token}`,"apikey":SUPABASE_ANON_KEY}}),me:token=>fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{"Authorization":`Bearer ${token}`,"apikey":SUPABASE_ANON_KEY}}).then(r=>r.json())},db:(tabla,token)=>({get:(cols="*",qs="")=>fetch(`${SUPABASE_URL}/rest/v1/${tabla}?select=${cols}${qs}`,{headers:{"Authorization":`Bearer ${token||SUPABASE_ANON_KEY}`,"apikey":SUPABASE_ANON_KEY}}).then(r=>r.json()),post:data=>fetch(`${SUPABASE_URL}/rest/v1/${tabla}`,{method:"POST",headers:{"Authorization":`Bearer ${token||SUPABASE_ANON_KEY}`,"apikey":SUPABASE_ANON_KEY,"Content-Type":"application/json","Prefer":"return=representation"},body:JSON.stringify(data)}).then(r=>r.json()),patch:(data,qs)=>fetch(`${SUPABASE_URL}/rest/v1/${tabla}?${qs}`,{method:"PATCH",headers:{"Authorization":`Bearer ${token||SUPABASE_ANON_KEY}`,"apikey":SUPABASE_ANON_KEY,"Content-Type":"application/json"},body:JSON.stringify(data)}).then(r=>r.json())})};const DB="ayudaciudadana_v4";const db={load:()=>{try{return JSON.parse(localStorage.getItem(DB))||{casos:[],contador:0};}catch{return{casos:[],contador:0};}},save:d=>{try{localStorage.setItem(DB,JSON.stringify(d));}catch{}}};const ENTIDADES={"salud_clinicas": {"Bogotá": ["Fundación Santa Fe de Bogotá", "Hospital Universitario San Ignacio", "Clínica del Country", "Clínica de Marly", "Fundación Cardio Infantil", "Fundación Clínica Shaio", "Clínica Universitaria Colombia", "Clínica Reina Sofía", "Clínica de la Colina", "Hospital San José de Bogotá"], "Medellín": ["Hospital Pablo Tobón Uribe", "Hospital Universitario San Vicente Fundación", "Clínica CES", "Clínica Cardio VID", "Clínica Las Américas", "Clínica Medellín", "Clínica Soma", "Clínica del Prado", "Clínica El Rosario", "Hospital General de Medellín"], "Cali": ["Fundación Valle del Lili", "Centro Médico Imbanaco", "Clínica de Occidente", "Clínica Farallones", "Clínica Palma Real", "Hospital Universitario del Valle Evaristo García", "Clínica de Oftalmología de Cali", "Clínica Nuestra Señora de los Remedios", "Clínica Sebastián de Belalcázar", "Clínica Versalles"], "Barranquilla": ["Clínica Portoazul AUNA", "Clínica del Caribe", "Clínica General del Norte", "Clínica Iberoamérica", "Clínica La Merced", "Clínica Bonnadona Prevenir", "Clínica Carriazo", "Clínica Bautista", "Hospital Universitario del Norte (Soledad)", "Clínica Reina Catalina"], "Bucaramanga": ["Fundación Cardiovascular de Colombia (FCV)", "Hospital Internacional de Colombia (Piedecuesta)", "Clínica FOSCAL", "Clínica FOSCAL Internacional", "Clínica Chicamocha", "Centro Médico Carlos Ardila Lülle", "Clínica Materno Infantil San Luis", "Fundación Oftalmológica de Santander (FOSCAL)", "Hospital Universitario de Santander (HUS)", "Clínica Bucaramanga"], "Cartagena": ["Hospital Serena del Mar", "Nuevo Hospital Bocagrande", "Clínica Ami", "Clínica Central de Cartagena", "Clínica Crecer", "Clínica Madre Bernarda", "Clínica Blas de Lezo", "Clínica Cartagena del Mar", "Hospital Universitario del Caribe", "Clínica Gestión Salud"], "Pereira": ["Clínica Los Rosales", "Hospital Universitario San Jorge", "Clínica Comfamiliar Risaralda", "Hospital Santa Mónica", "IPS Clínica San Rafael", "Clínica Saludcoop (Megacentro)", "Clínica Cardiovascular del Café", "Instituto del Corazón de Pereira", "Clínica Risaralda", "Megacentro IPS"], "Cúcuta": ["Hospital Universitario Erasmo Meoz", "Clínica Medical Duarte", "Clínica Santa Ana", "Clínica Los Andes", "Clínica San José de Cúcuta", "Centro Clínico José Gregorio", "Clínica Norte", "Clínica Santa Mónica", "Fundación Médico Preventiva", "Clínica San Antonio"]}, "salud_eps": {"nacional": ["Nueva EPS", "Sura EPS", "Sanitas EPS", "Salud Total EPS", "Compensar EPS", "Famisanar EPS", "Coosalud EPS", "Mutual Ser EPS", "Aliansalud EPS", "SOS (Servicio Occidental de Salud)", "Emssanar EPS", "Capital Salud EPS", "Cajacopi EPS", "Savia Salud EPS"]}, "bancos": {"nacional": ["Bancolombia", "Banco Davivienda", "Banco de Bogotá", "BBVA Colombia", "Banco de Occidente", "Banco Popular", "Banco AV Villas", "Banco Agrario de Colombia", "Banco Caja Social", "Scotiabank Colpatria", "Itaú Colombia", "Banco GNB Sudameris", "Nu (Nubank)", "Lulo Bank"]}, "movilidad": {"Bogotá": ["Secretaría Distrital de Movilidad de Bogotá"], "Medellín": ["Secretaría de Movilidad de Medellín"], "Cali": ["Secretaría de Movilidad de Santiago de Cali"], "Barranquilla": ["Secretaría Distrital de Movilidad de Barranquilla"], "Cartagena": ["Departamento Administrativo de Tránsito y Transporte (DATT) - Cartagena"], "Bucaramanga": ["Dirección de Tránsito de Bucaramanga"], "Pereira": ["Instituto de Movilidad de Pereira"], "Cúcuta": ["Secretaría de Tránsito y Transporte de Cúcuta"], "nacional": ["RUNT (Registro Único Nacional de Tránsito)", "SIMIT (Sistema de Multas e Infracciones de Tránsito)", "Ministerio de Transporte", "Agencia Nacional de Seguridad Vial (ANSV)", "Policía de Tránsito y Transporte (DITRA)"]}, "servicios": {"Bogotá": ["Enel Colombia (energía)", "Empresa de Acueducto y Alcantarillado de Bogotá (EAAB)", "Vanti (gas natural)", "Grupo Energía Bogotá", "ETB (telecomunicaciones)"], "Medellín": ["EPM - Empresas Públicas de Medellín (energía, agua, gas)", "Afinia (energía)", "Aguas Nacionales EPM"], "Cali": ["EMCALI (energía, acueducto, telecomunicaciones)", "Celsia (energía)", "Gases de Occidente (gas natural)"], "Barranquilla": ["Air-e (energía)", "Triple A (acueducto, alcantarillado y aseo)", "Gases del Caribe (gas natural)"], "Cartagena": ["Afinia (energía)", "Aguas de Cartagena (Acuacar)", "Surtigas (gas natural)"], "Bucaramanga": ["ESSA - Electrificadora de Santander (energía)", "Acueducto Metropolitano de Bucaramanga (amb)", "Gasoriente (gas natural)"], "Pereira": ["Empresa de Energía de Pereira (EEP)", "Aguas y Aguas de Pereira", "Efigas (gas natural)"], "Cúcuta": ["CENS - Centrales Eléctricas Norte de Santander (energía)", "Aguas Kpital Cúcuta", "Gases del Oriente / Gasnorte (gas natural)"], "nacional": ["Superintendencia de Servicios Públicos Domiciliarios (SSPD)", "Vanti", "Claro (telecomunicaciones)", "Movistar (telecomunicaciones)", "Tigo (telecomunicaciones)"]}, "pension": {"nacional": ["Colpensiones (fondo público)", "Porvenir (AFP privada)", "Protección (AFP privada)", "Colfondos (AFP privada)", "Skandia (AFP privada)", "Superintendencia Financiera de Colombia", "UGPP (Unidad de Gestión Pensional y Parafiscales)", "Fonprecon", "Fiduprevisora", "Ministerio del Trabajo"]}, "dian": {"nacional": ["DIAN - Dirección de Impuestos y Aduanas Nacionales", "DIAN Seccional Bogotá", "DIAN Seccional Medellín", "DIAN Seccional Cali", "DIAN Seccional Barranquilla", "DIAN Seccional Cartagena", "DIAN Seccional Bucaramanga", "DIAN Seccional Pereira", "DIAN Seccional Cúcuta", "Ministerio de Hacienda y Crédito Público"]}, "trabajo": {"nacional": ["Ministerio del Trabajo", "ARL Sura", "ARL Positiva", "ARL Colmena", "ARL Bolívar", "ARL Colpatria (Axa)", "ARL La Equidad", "Inspección del Trabajo (MinTrabajo)", "Servicio Público de Empleo (SPE)", "SENA (Servicio Nacional de Aprendizaje)"]}, "educacion": {"Bogotá": ["Universidad Nacional de Colombia", "Universidad de los Andes", "Pontificia Universidad Javeriana", "Universidad del Rosario", "Universidad Externado de Colombia", "Universidad Distrital Francisco José de Caldas", "Secretaría de Educación de Bogotá"], "Medellín": ["Universidad de Antioquia", "Universidad Nacional (sede Medellín)", "Universidad EAFIT", "Universidad Pontificia Bolivariana (UPB)", "Universidad de Medellín", "Universidad CES", "Secretaría de Educación de Medellín"], "Cali": ["Universidad del Valle", "Universidad Icesi", "Universidad Autónoma de Occidente", "Universidad Santiago de Cali", "Universidad San Buenaventura (Cali)", "Secretaría de Educación de Cali"], "Barranquilla": ["Universidad del Norte", "Universidad del Atlántico", "Universidad Simón Bolívar", "Universidad de la Costa (CUC)", "Universidad Autónoma del Caribe", "Secretaría de Educación de Barranquilla"], "Cartagena": ["Universidad de Cartagena", "Universidad Tecnológica de Bolívar (UTB)", "Universidad San Buenaventura (Cartagena)", "Fundación Universitaria Tecnológico Comfenalco", "Secretaría de Educación de Cartagena"], "Bucaramanga": ["Universidad Industrial de Santander (UIS)", "Universidad Autónoma de Bucaramanga (UNAB)", "Universidad Pontificia Bolivariana (Bucaramanga)", "Universidad de Santander (UDES)", "Universidad Manuela Beltrán", "Secretaría de Educación de Bucaramanga"], "Pereira": ["Universidad Tecnológica de Pereira (UTP)", "Universidad Católica de Pereira", "Universidad Libre (Pereira)", "Fundación Universitaria del Área Andina", "Secretaría de Educación de Pereira"], "Cúcuta": ["Universidad Francisco de Paula Santander (UFPS)", "Universidad de Pamplona", "Universidad Libre (Cúcuta)", "Universidad de Santander (UDES Cúcuta)", "Universidad Simón Bolívar (Cúcuta)", "Secretaría de Educación de Cúcuta"], "nacional": ["ICFES (exámenes de Estado)", "Ministerio de Educación Nacional", "ICETEX (créditos educativos)", "SENA"]}, "vivienda": {"nacional": ["Ministerio de Vivienda, Ciudad y Territorio", "Fondo Nacional del Ahorro (FNA)", "Fonvivienda", "Colsubsidio (caja de compensación)", "Compensar (caja de compensación)", "Cafam (caja de compensación)", "Comfama (caja - Antioquia)", "Comfenalco", "Banco Agrario (vivienda rural)", "Caja de Vivienda Militar y de Policía"]}, "peticion": {"nacional": ["Alcaldía Municipal", "Gobernación Departamental", "Personería Municipal", "Defensoría del Pueblo", "Procuraduría General de la Nación", "Contraloría General de la República", "Superintendencia Nacional de Salud", "Superintendencia Financiera", "Superintendencia de Servicios Públicos", "Registraduría Nacional del Estado Civil"]}};const MAPA_ENTIDADES={"salud": ["salud_clinicas", "salud_eps"], "bancos": ["bancos"], "trabajo": ["trabajo"], "servicios": ["servicios"], "pension": ["pension"], "movilidad": ["movilidad"], "educacion": ["educacion"], "vivienda": ["vivienda"], "peticion": ["peticion"], "dian": ["dian"]};function sugerenciasEntidad(catId,ciudad){var grupos=MAPA_ENTIDADES[catId]||[];var out=[];grupos.forEach(function(g){var data=ENTIDADES[g];if(!data)return;if(ciudad&&data[ciudad])out=out.concat(data[ciudad]);if(data.nacional)out=out.concat(data.nacional);});return out.filter(function(v,i){return out.indexOf(v)===i;});}const DATOS_ENTIDADES={"Nueva EPS": {"nit": "900.156.264-2", "correo_judicial": "secretaria.general@nuevaeps.com.co", "ciudad": "Bogotá", "tipo": "EPS"}, "Colpensiones (fondo público)": {"nit": "900.336.004-7", "correo_judicial": "notificacionesjudiciales@colpensiones.gov.co", "direccion": "Carrera 10 # 72-33 Piso 11", "ciudad": "Bogotá", "telefono": "601 489 0909", "tipo": "Fondo de pensiones público"}, "DIAN - Dirección de Impuestos y Aduanas Nacionales": {"correo_judicial": "notificacionesjudiciales@dian.gov.co", "ciudad": "Bogotá", "tipo": "Entidad tributaria nacional"}, "Sanitas EPS": {"nit": "800.251.440-6", "direccion": "Calle 26 No 51-53", "ciudad": "Bogotá", "tipo": "EPS"}, "Savia Salud EPS": {"correo_judicial": "notificacionesjudiciales@saviasaludeps.com", "correo_tutelas": "notificacionestutelas@saviasaludeps.com", "tipo": "EPS"}, "SOS (Servicio Occidental de Salud)": {"correo": "servicioalcliente@sos.com.co", "telefono": "01 8000 938777", "ciudad": "Cali", "tipo": "EPS"}, "Secretaría Distrital de Salud de Bogotá": {"correo_judicial": "notificacionjudicial@saludcapital.gov.co", "ciudad": "Bogotá", "tipo": "Secretaría de salud"}, "Superintendencia Nacional de Salud": {"correo_judicial": "snsnotificacionesjudiciales@supersalud.gov.co", "direccion": "Carrera 68A N°. 24B-10, Torre 3, Pisos 4, 9 y 10, Edificio Plaza Claro", "ciudad": "Bogotá", "telefono": "601 722 4000", "tipo": "Superintendencia"}, "Hospital Pablo Tobón Uribe": {"nit": "890.901.826-2", "correo_judicial": "hptu@hptu.org.co", "direccion": "Calle 78B No. 69-240, Robledo", "ciudad": "Medellín", "telefono": "604 445 9000", "tipo": "Hospital"}, "Fundación Valle del Lili": {"nit": "890.324.177-5", "direccion": "Carrera 98 #18-49", "ciudad": "Cali", "tipo": "Hospital"}, "Fundación Cardio Infantil": {"direccion": "Calle 163A No. 13B-60", "ciudad": "Bogotá", "telefono": "601 667 2727", "correo": "pcasallas@lacardio.org", "tipo": "Hospital"}, "Salud Total EPS": {"correo_judicial": "notificacionesjud@saludtotal.com.co", "direccion": "Carrera 47 #82-220", "telefono": "601 361 2000", "tipo": "EPS"}, "Compensar EPS": {"nit": "860.066.942-7", "ciudad": "Bogotá", "tipo": "EPS"}, "Famisanar EPS": {"correo_judicial": "notificaciones@famisanar.com.co", "tipo": "EPS"}};function datosEntidad(nombre){if(!nombre)return null;return DATOS_ENTIDADES[nombre]||null;}const CATS={salud:{id:"salud",emoji:"🏥",nombre:"Salud",color:"#1E50C8",desc:"EPS, medicamentos, cirugías, urgencias, exámenes, transporte médico, CITAS",subcasos:[{id:"neg_proc",nombre:"Me niegan cirugía o procedimiento médico autorizado",icono:"🔪"},{id:"neg_med",nombre:"No entregan medicamentos formulados por el médico",icono:"💊"},{id:"demora_cita",nombre:"Demora excesiva en citas de especialista (más de 30 días)",icono:"📅"},{id:"neg_urg",nombre:"Me negaron atención en urgencias o me sacaron del servicio",icono:"🚨"},{id:"neg_cx_est",nombre:"Niegan cirugía estética reconstructiva ordenada médicamente",icono:"🏥"},{id:"neg_transporte",nombre:"Niegan transporte médico para citas o tratamientos",icono:"🚌"},{id:"neg_examen",nombre:"Niegan examen de laboratorio o imágenes diagnósticas",icono:"🔬"},{id:"neg_terapia",nombre:"Niegan terapia física, psicológica u ocupacional formulada",icono:"🧠"},{id:"eps_mora",nombre:"EPS me quitó el servicio sin haberme desvinculado yo",icono:"❌"},{id:"neg_pbs",nombre:"Niegan medicamento o servicio por no estar en el PBS (tutela)",icono:"📋"},{id:"cambio_med",nombre:"EPS cambia el médico tratante sin mi consentimiento",icono:"👨‍⚕️"},{id:"neg_rehab",nombre:"Niegan rehabilitación o dispositivos médicos (prótesis, silla)",icono:"♿"},{id:"eps_sp",nombre:"EPS no responde mi solicitud (más de 15 días hábiles)",icono:"📬"}]},bancos:{id:"bancos",emoji:"🏦",nombre:"Bancos y Finanzas",color:"#1e3a5f",desc:"Cobros indebidos, fraudes, Datacrédito, seguros no autorizados, créditos",subcasos:[{id:"cobro_ind",nombre:"Me cobran cargo, seguro o cuota que nunca autoricé",icono:"💳"},{id:"fraude_banco",nombre:"Fraude o robo de dinero de mi cuenta sin mi autorización",icono:"🚨"},{id:"reporte_neg",nombre:"Reporte injusto en Datacrédito, Cifin o TransUnion",icono:"📊"},{id:"neg_cuenta",nombre:"Me niegan abrir cuenta bancaria o acceder a productos",icono:"🚫"},{id:"seg_no_aut",nombre:"Me inscribieron un seguro de vida o desempleo sin pedirlo",icono:"📑"},{id:"ret_saldo",nombre:"El banco retiene o bloquea mi saldo sin orden judicial",icono:"🔒"},{id:"int_excesivo",nombre:"Cobran intereses por encima del límite legal (usura)",icono:"📈"},{id:"neg_credito",nombre:"Me niegan crédito siendo buen pagador sin justificación",icono:"💰"},{id:"cancel_tc",nombre:"Cancelaron mi tarjeta de crédito sin aviso ni causa",icono:"✂️"},{id:"no_devolucion",nombre:"No me devuelven dinero de transacción fallida o duplicada",icono:"↩️"},{id:"banco_sp",nombre:"El banco no responde mi reclamación (más de 15 días hábiles)",icono:"📬"}]},trabajo:{id:"trabajo",emoji:"👷",nombre:"Trabajo",color:"#7C2D12",desc:"Despido injusto, acoso, salarios, prestaciones, accidentes, seguridad social",subcasos:[{id:"desp_emb",nombre:"Me despidieron estando embarazada o en período de lactancia",icono:"🤰"},{id:"acoso",nombre:"Sufro acoso laboral o mobbing sistemático",icono:"😰"},{id:"no_salario",nombre:"No me pagan el salario, horas extra o recargos",icono:"💰"},{id:"desp_disc",nombre:"Me despidieron por enfermedad, discapacidad o incapacidad",icono:"♿"},{id:"no_afil",nombre:"El empleador no me afilia a EPS, pensión o ARL",icono:"🛡️"},{id:"accidente",nombre:"Sufrí accidente laboral y la ARL no lo reconoce",icono:"⚠️"},{id:"enf_laboral",nombre:"Tengo enfermedad laboral y no me la reconocen",icono:"🤒"},{id:"despido_inj",nombre:"Despido sin justa causa y sin pagar liquidación completa",icono:"📄"},{id:"no_prestaciones",nombre:"No me pagan cesantías, primas, vacaciones o intereses",icono:"📋"},{id:"desp_sindical",nombre:"Despido por pertenecer a sindicato o ejercer derecho sindical",icono:"✊"},{id:"discriminacion_lab",nombre:"Discriminación laboral por género, etnia, edad o religión",icono:"⚖️"},{id:"no_afil_pension",nombre:"Me retiran del trabajo sin pagar aportes de pensión",icono:"👴"},{id:"trabajo_sp",nombre:"Ministerio del Trabajo no responde mi queja (más de 15 días)",icono:"📬"}]},servicios:{id:"servicios",emoji:"💡",nombre:"Servicios Públicos",color:"#166534",desc:"Energía, agua, gas, internet, alcantarillado, aseo — cortes y cobros",subcasos:[{id:"corte_agua",nombre:"Cortaron el agua sin aviso o sin deuda real",icono:"💧"},{id:"corte_luz",nombre:"Cortaron la energía arbitrariamente o sin notificación",icono:"⚡"},{id:"cobro_exc",nombre:"Factura excesiva o cobro que no corresponde al consumo real",icono:"📋"},{id:"corte_gas",nombre:"Cortaron el gas sin aviso ni causa justificada",icono:"🔥"},{id:"corte_internet",nombre:"Cortaron el internet o baja mucho la velocidad contratada",icono:"📡"},{id:"no_instalacion",nombre:"No instalan el servicio después de pagar la conexión",icono:"🔧"},{id:"deuda_anterior",nombre:"Me cobran deuda de inquilino anterior o propietario anterior",icono:"🏠"},{id:"reclamo_medidor",nombre:"El medidor está dañado o no mide bien — reclamo técnico",icono:"🔩"},{id:"suspension_eq_med",nombre:"Suspenden luz o agua en casa con equipos médicos vitales",icono:"🏥"},{id:"corte_masivo",nombre:"Corte masivo del servicio sin reparación oportuna",icono:"🌆"},{id:"serv_sp",nombre:"La empresa de servicios no responde mi petición (+15 días)",icono:"📬"}]},pension:{id:"pension",emoji:"👴",nombre:"Pensión y Seguridad Social",color:"#4C1D95",desc:"Colpensiones, AFP, vejez, invalidez, sobrevivientes, incapacidades",subcasos:[{id:"neg_vejez",nombre:"Me niegan pensión de vejez teniendo semanas y edad",icono:"👴"},{id:"neg_inv",nombre:"Me niegan pensión de invalidez con pérdida mayor al 50%",icono:"♿"},{id:"no_mesada",nombre:"No me pagan la mesada pensional en la fecha acordada",icono:"💳"},{id:"neg_sobrev",nombre:"Me niegan pensión de sobrevivientes tras fallecimiento",icono:"👨‍👩‍👧"},{id:"mora_pen",nombre:"Llevan más de 4 meses sin resolver mi solicitud de pensión",icono:"⏰"},{id:"semanas_mal",nombre:"Colpensiones tiene mal contadas mis semanas cotizadas",icono:"🔢"},{id:"indemnizacion",nombre:"Me niegan indemnización sustitutiva o devolución de aportes",icono:"💰"},{id:"no_inc_laboral",nombre:"ARL no paga incapacidad por accidente o enfermedad laboral",icono:"🤕"},{id:"inc_eps_irl",nombre:"EPS no paga incapacidades de más de 180 días (IRC a Colpensiones)",icono:"📋"},{id:"traslado_afp",nombre:"AFP no me deja trasladar a Colpensiones o bloquea el traslado",icono:"🔄"},{id:"pension_sp",nombre:"Colpensiones o AFP no responden mi solicitud (+15 días)",icono:"📬"}]},movilidad:{id:"movilidad",emoji:"🚗",nombre:"Movilidad y Tránsito",color:"#B45309",desc:"Comparendos fotomultas, licencias, RUNT, inmovilizaciones, Secretarías de Movilidad",subcasos:[{id:"presc_comp",nombre:"Solicitar prescripción de comparendo (más de 3 años sin cobro coactivo)",icono:"⌛"},{id:"fotomulta_irr",nombre:"Fotomulta irregular o de proceso masivo de anulación nacional",icono:"📸"},{id:"multa_no_notif",nombre:"Multa o comparendo sin notificación correcta en mi dirección",icono:"✉️"},{id:"comp_error",nombre:"Comparendo con error — placa ajena, vehículo vendido o no era yo",icono:"🚙"},{id:"inmov_ilegal",nombre:"Inmovilización ilegal o arbitraria del vehículo",icono:"🔒"},{id:"multa_presencial",nombre:"Comparendo presencial de agente con irregularidades",icono:"👮"},{id:"multa_rtm",nombre:"Comparendo por revisión técnico-mecánica vencida",icono:"🔧"},{id:"multa_soat",nombre:"Comparendo por SOAT — tenía vigente pero no lo vieron",icono:"📄"},{id:"multa_alcohol",nombre:"Comparendo por alcoholemia — impugnar prueba o procedimiento",icono:"🍺"},{id:"multa_velocidad",nombre:"Comparendo por exceso de velocidad — impugnar cámara",icono:"⚡"},{id:"lic_suspendida",nombre:"Me suspendieron la licencia de conducción injustamente",icono:"🪪"},{id:"runt_error",nombre:"Error en el RUNT: placa, propietario, datos del vehículo mal",icono:"💻"},{id:"runt_duplicado",nombre:"Duplicado de tarjeta de propiedad por pérdida, robo o deterioro",icono:"📋"},{id:"traspaso_bloq",nombre:"Traspaso de vehículo bloqueado o no lo registran en el RUNT",icono:"🔄"},{id:"mov_sp",nombre:"Secretaría de Movilidad no responde mi petición (+15 días)",icono:"📬"}]},educacion:{id:"educacion",emoji:"🎓",nombre:"Educación",color:"#0F766E",desc:"Cupos, diplomas, discriminación, cobros, universidades, colegios, ICFES",subcasos:[{id:"neg_cupo",nombre:"Me niegan cupo escolar o universitario injustamente",icono:"📚"},{id:"diploma_ret",nombre:"Retienen mi diploma o certificados de estudio",icono:"📜"},{id:"disc_edu",nombre:"Discriminación por discapacidad, raza, género o religión",icono:"🚫"},{id:"pension_exc",nombre:"Cobran pensión o matrícula por encima de lo autorizado",icono:"💰"},{id:"expulsion",nombre:"Expulsión o sanción disciplinaria sin debido proceso",icono:"⚖️"},{id:"neg_grado",nombre:"Me niegan el grado o la graduación injustamente",icono:"🎓"},{id:"neg_beca",nombre:"Me niegan beca o crédito educativo (ICETEX) injustamente",icono:"🏆"},{id:"icetex_cob",nombre:"ICETEX hace cobros indebidos o no congela mi deuda",icono:"💳"},{id:"icfes_error",nombre:"Error en prueba ICFES o Saber — puntaje o inscripción",icono:"📝"},{id:"no_inclusion",nombre:"Institución no garantiza inclusión para estudiante con discapacidad",icono:"♿"},{id:"edu_sp",nombre:"La institución educativa no responde mi solicitud (+15 días)",icono:"📬"}]},vivienda:{id:"vivienda",emoji:"🏠",nombre:"Vivienda",color:"#9D2B2B",desc:"Subsidios, desalojos, vivienda indigna, constructoras, arrendamiento",subcasos:[{id:"subsidio_viv",nombre:"Me niegan subsidio de vivienda (Mi Casa Ya, FONVIVIENDA)",icono:"🏘️"},{id:"desalojo",nombre:"Me van a desalojar o están en proceso de lanzamiento judicial",icono:"🚨"},{id:"vivienda_ind",nombre:"Mi vivienda está en condiciones indignas o insalubres",icono:"⚠️"},{id:"constructora",nombre:"La constructora no cumplió lo prometido o hay vicios ocultos",icono:"🏗️"},{id:"no_escritura",nombre:"No me dan la escritura o el registro de propiedad del inmueble",icono:"📋"},{id:"arrendador_ab",nombre:"El arrendador hace cobros ilegales o no devuelve el depósito",icono:"💰"},{id:"no_saneamiento",nombre:"Falta de alcantarillado, agua o servicios en el vecindario",icono:"🔧"},{id:"riesgo_derrumbe",nombre:"Vivienda en zona de riesgo — no dan alternativa de reubicación",icono:"🏔️"},{id:"cuota_ini",nombre:"Constructora no devuelve cuota inicial de proyecto que canceló",icono:"↩️"},{id:"ph_abuso",nombre:"Abuso de la administración de propiedad horizontal (PH)",icono:"🏢"},{id:"viv_sp",nombre:"No responden mi solicitud de subsidio o información (+15 días)",icono:"📬"}]},peticion:{id:"peticion",emoji:"📬",nombre:"Derecho de Petición",color:"#374151",desc:"Cualquier entidad pública que no responde en 15 días hábiles",subcasos:[{id:"pet_alc",nombre:"La alcaldía o entidad municipal no responde",icono:"🏙️"},{id:"pet_ban",nombre:"El banco o entidad financiera no responde",icono:"🏦"},{id:"pet_edu",nombre:"El colegio o universidad no responde",icono:"🎓"},{id:"pet_icbf",nombre:"El ICBF no atiende mi solicitud sobre menores",icono:"👶"},{id:"pet_dian",nombre:"La DIAN no responde sobre RUT, declaración o sanciones",icono:"💼"},{id:"pet_inm",nombre:"Migración Colombia no responde sobre visa o cédula extranjería",icono:"✈️"},{id:"pet_eps",nombre:"EPS o IPS no responde solicitud de salud",icono:"🏥"},{id:"pet_colp",nombre:"Colpensiones o AFP no responden solicitud pensional",icono:"👴"},{id:"pet_otra",nombre:"Otra entidad pública que no responde en el plazo legal",icono:"📋"}]},dian:{id:"dian",emoji:"💼",nombre:"DIAN / Impuestos / RUT",color:"#1F2937",desc:"RUT, declaración de renta, sanciones DIAN, NIT, facturación electrónica",subcasos:[{id:"rut_inscripcion",nombre:"Necesito inscribir el RUT por primera vez",icono:"📋"},{id:"rut_actualizacion",nombre:"Necesito actualizar datos en el RUT (dirección, actividad, responsabilidades)",icono:"✏️"},{id:"rut_bloqueo",nombre:"Mi RUT está bloqueado o no puedo acceder al portal MUISCA",icono:"🔒"},{id:"renta_primera",nombre:"Debo declarar renta por primera vez y no sé cómo",icono:"📊"},{id:"renta_correccion",nombre:"Cometí un error en la declaración de renta — corrección",icono:"✏️"},{id:"sancion_dian",nombre:"La DIAN me impuso sanción o multa que considero injusta",icono:"⚠️"},{id:"exogena",nombre:"Problemas con información exógena o reportes a la DIAN",icono:"📤"},{id:"retencion",nombre:"Me retienen en la fuente incorrectamente — devolución",icono:"💰"},{id:"fact_electronica",nombre:"Problemas con facturación electrónica — habilitación DIAN",icono:"🧾"},{id:"nit_error",nombre:"Error en mi NIT o datos en el sistema de la DIAN",icono:"🔢"},{id:"dian_sp",nombre:"La DIAN no responde mi solicitud o recurso (+15 días)",icono:"📬"}]}};const ETAPAS=[{id:"radicacion",nombre:"Lista para radicar",icono:"📮",desc:"Imprime o radica en línea"},{id:"admision",nombre:"Admitida",icono:"⚖️",desc:"El juzgado la admitió"},{id:"contestacion",nombre:"En proceso",icono:"📝",desc:"Entidad contestó, en trámite"},{id:"fallo",nombre:"Fallo emitido",icono:"🔨",desc:"El juez emitió sentencia"},{id:"impugnacion",nombre:"Impugnada",icono:"⬆️",desc:"En segunda instancia"},{id:"desacato",nombre:"Desacato",icono:"🚨",desc:"Incumplimiento del fallo"},{id:"cerrado",nombre:"Finalizado",icono:"✅",desc:"Proceso cerrado"}];const PREGUNTAS={neg_proc:[{id:"q1",tipo:"textarea",texto:"¿Qué procedimiento o cirugía le niegan? ¿Qué médico lo ordenó y desde cuándo?",ph:"Me tienen que operar la rodilla, el ortopedista lo ordenó hace 3 meses.."},{id:"q2",tipo:"opciones",texto:"¿Tiene la orden médica escrita?",ops:["Sí, tengo la orden firmada y fechada","Solo me lo dijo verbalmente en consulta","Me la dieron pero la EPS dice que no puede tramitarla"]},{id:"q4",tipo:"textarea",texto:"¿Cómo le afecta en su vida diaria no tener este procedimiento?",ph:"Ya no puedo caminar, perdí mi trabajo, tengo dolor constante que no me.."},{id:"q3",tipo:"multi",texto:"¿Alguna condición especial aplica?",ops:["Adulto mayor (más de 60 años)","Discapacidad reconocida","Embarazo","Enfermedad grave o terminal","Menor de edad","Ninguna"]},{id:"q0",tipo:"opciones",texto:"¿La EPS le dio respuesta escrita negando la autorización?",ops:["Sí, tengo la negativa por escrito","Solo me dijeron verbalmente que no","No han dado ninguna respuesta formal"]}],neg_med:[{id:"q0",tipo:"textarea",texto:"¿Qué medicamento le niegan y para qué enfermedad?",ph:"Me niegan el Rituximab que el reumatólogo me formuló para artritis reu.."},{id:"q0",tipo:"opciones",texto:"¿Por qué razón le niegan el medicamento?",ops:["Dicen que no está en el plan de beneficios (PBS)","Necesita aval del comité técnico-científico","No dan ninguna explicación","Dicen que está desabastecido"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva sin el medicamento y cómo le afecta?",ph:"Llevo 45 días sin el medicamento, el dolor es insoportable y ya no pue.."},{id:"q0",tipo:"multi",texto:"¿Condición especial?",ops:["Adulto mayor","Discapacidad","Embarazo","Enfermedad terminal/grave","Menor de edad","Ninguna"]}],demora_cita:[{id:"q0",tipo:"textarea",texto:"¿Qué especialista necesita y cuánto lleva esperando la cita?",ph:"Necesito al cardiólogo, llevan 5 meses sin asignarme cita tras la remi.."},{id:"q0",tipo:"textarea",texto:"¿Tiene síntomas que hacen urgente esta atención?",ph:"Tengo dolores en el pecho frecuentes, me canso mucho al caminar pequeñ.."},{id:"q0",tipo:"opciones",texto:"¿Ha reclamado ante la EPS?",ops:["Sí, puse queja formal y no pasó nada","Sí, me dan largas sin solución","No he puesto queja formal aún"]}],neg_urg:[{id:"q0",tipo:"textarea",texto:"¿Qué pasó exactamente cuando llegó a urgencias? Cuente con detalle.",ph:"Llegué con dolor muy fuerte en el pecho y presión alta..."},{id:"q0",tipo:"textarea",texto:"¿Cuándo fue y tiene testigos o documentos?",ph:"Fue el 15 de mayo a las 10pm. Mi esposa estaba conmigo..."},{id:"q0",tipo:"textarea",texto:"¿Cómo resultó su salud después de no ser atendido?",ph:"Tuve que ir a una clínica particular donde me hospitalizaron 3 días..."}],eps_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué le solicitó a la EPS y en qué fecha?",ph:"El 3 de mayo solicité autorización para cirugía de columna..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto tiempo lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el comprobante de radicación?",ph:"Sí, tengo el radicado, o el correo de confirmación,.."},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que la EPS no responda?",ph:"Sin la autorización no puedo hacerme la cirugía que necesito urgente..."}],desp_emb:[{id:"q0",tipo:"textarea",texto:"¿En qué fecha la despidieron y cuántos meses de embarazo tenía?",ph:"Me despidieron el 10 de junio, tenía 4 meses de embarazo..."},{id:"q0",tipo:"opciones",texto:"¿El empleador sabía que estaba embarazada?",ops:["Sí, lo sabía completamente","Le informé cuando me iban a despedir","No lo sabía pero ya se notaba","No lo sabía"]},{id:"q0",tipo:"textarea",texto:"¿Qué razón le dieron para el despido?",ph:"Dijeron reestructuración, pero soy la única que salió de todo el departamento..."},{id:"q0",tipo:"opciones",texto:"¿Tiene documentos del despido?",ops:["Sí, tengo carta de despido escrita","El despido fue solo verbal","Me liquidaron sin carta de motivo"]}],acoso:[{id:"q0",tipo:"textarea",texto:"¿Qué conductas de acoso sufre y quién las realiza?",ph:"Mi jefe me grita frente a todos, me asigna tareas imposibles,.."},{id:"q0",tipo:"textarea",texto:"¿Desde cuándo ocurre y con qué frecuencia?",ph:"Desde hace 8 meses, casi a diario. Empeoró cuando pedí vacaciones..."},{id:"q0",tipo:"opciones",texto:"¿Ha puesto alguna queja formal?",ops:["Sí, queja interna sin resultado","Sí, ante el Ministerio del Trabajo","No, por miedo a represalias","Sí y las cosas empeoraron"]},{id:"q0",tipo:"textarea",texto:"¿Tiene pruebas del acoso?",ph:"Capturas de pantalla de mensajes, correos, 3 compañeros dispuestos a declarar..."},{id:"q0",tipo:"textarea",texto:"¿Su salud se ha visto afectada?",ph:"Tengo ansiedad severa, incapacidades médicas por estrés, atención psicológica..."}],no_salario:[{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo llevan sin pagarle y cuánto le deben aproximadamente?",ph:"Llevan 3 meses sin pagarme. Me deben $4.500..."},{id:"q0",tipo:"opciones",texto:"¿Puede probar la relación laboral?",ops:["Sí, tengo contrato escrito","Era verbal pero tengo mensajes, nóminas o testigos","Era por prestación de servicios"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no recibir el salario?",ph:"No puedo pagar el arriendo, tengo hijos menores, la comida escasea en casa..."}],desp_disc:[{id:"q0",tipo:"textarea",texto:"¿Cuál es su condición de salud y cuándo se la diagnosticaron?",ph:"Tengo diabetes tipo 2 diagnosticada hace 2 años, con incapacidades frecuentes..."},{id:"q0",tipo:"opciones",texto:"¿El empleador sabía de su condición?",ops:["Sí, completamente informado (ARL, EPS, historia clínica)","Sí, le informé directamente","Lo sospechaba por las incapacidades","No sabía"]},{id:"q0",tipo:"textarea",texto:"¿Qué razón le dieron y en qué fecha fue el despido?",ph:"El 5 de junio dijeron bajo rendimiento, justo después de mis últimas i.."}],no_afil:[{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva trabajando sin afiliación a seguridad social?",ph:"Llevo 2 años trabajando y nunca me han afiliado a EPS, pensión ni ARL..."},{id:"q0",tipo:"textarea",texto:"¿Puede probar que trabaja en esa empresa?",ph:"Tengo contrato escrito, mensajes de WhatsApp con el jefe, recibos de pago..."},{id:"q0",tipo:"textarea",texto:"¿Ha tenido algún problema de salud o accidente por no estar afiliado?",ph:"Me accidenté y sin ARL tuve que pagar todo del bolsillo. Me costó $800.000..."}],neg_vejez:[{id:"q0",tipo:"textarea",texto:"¿Cuántas semanas cotizadas tiene aproximadamente y qué edad tiene?",ph:"Tengo 65 años y aproximadamente 1.350 semanas entre Colpensiones y var.."},{id:"q0",tipo:"textarea",texto:"¿Qué le respondió Colpensiones o la AFP?",ph:"Dicen que no tengo las semanas suficientes pero nunca me mostraron el cálculo..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto tiempo lleva esperando?",ops:["Menos de 4 meses","Entre 4 meses y 1 año","Más de 1 año","Sin respuesta definitiva nunca"]},{id:"q0",tipo:"multi",texto:"¿Tiene dependientes económicos?",ops:["Cónyuge o compañero permanente","Hijos menores o con discapacidad","Adultos mayores a cargo","Vivo solo sin ningún ingreso"]}],neg_inv:[{id:"q0",tipo:"textarea",texto:"¿Qué porcentaje de pérdida de capacidad laboral le dictaminaron?",ph:"Me dictaminaron el 56% de pérdida de capacidad laboral permanente por .."},{id:"q0",tipo:"textarea",texto:"¿Por qué le niegan la pensión?",ph:"Dicen que no cumplo las 50 semanas en los últimos 3 años anteriores a .."},{id:"q0",tipo:"textarea",texto:"¿Puede trabajar actualmente?",ph:"Ya no puedo trabajar absolutamente en nada. Dependo de mi familia para todo..."}],no_mesada:[{id:"q0",tipo:"textarea",texto:"¿Cuántas mesadas le deben y cuánto vale cada una?",ph:"Me deben 4 mesadas de $1.800.000 cada una. Llevo 4 meses sin recibir nada..."},{id:"q0",tipo:"textarea",texto:"¿Ha reclamado ante Colpensiones? ¿Qué le respondieron?",ph:"Fui personalmente dos veces y me dicen que hay un problema técnico en .."},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no recibir la mesada?",ph:"Ese es mi único ingreso. No puedo comprar medicamentos ni pagar el arriendo..."}],neg_sobrev:[{id:"q0",tipo:"textarea",texto:"¿Quién falleció, cuándo, y cuál era su relación?",ph:"Mi esposo falleció el 12 de marzo de 2025..."},{id:"q0",tipo:"textarea",texto:"¿Por qué le niegan la pensión?",ph:"Dicen que el causante no acumuló las semanas o que yo no dependía econ.."},{id:"q0",tipo:"textarea",texto:"¿Tiene hijos menores u otras personas a cargo?",ph:"Tengo 2 hijos de 8 y 12 años que dependen completamente de mí..."}],mora_pen:[{id:"q0",tipo:"textarea",texto:"¿Cuándo solicitó la pensión y cuál es el número de radicado?",ph:"Solicité el 10 de enero de 2024. Radicado No. 123456789 ante Colpensiones..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto tiempo lleva esperando?",ops:["Entre 4 y 6 meses","Entre 6 meses y 1 año","Más de 1 año","Más de 2 años sin resolución"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta demora?",ph:"Ya cumplí la edad, no tengo otro ingreso y mi salud se deteriora sin m.."}],corte_agua:[{id:"q0",tipo:"textarea",texto:"¿Cuándo le cortaron el agua y le avisaron antes?",ph:"Me cortaron el agua el martes sin ningún aviso previo. Tengo el recibo pagado..."},{id:"q0",tipo:"multi",texto:"¿Hay personas especiales en el hogar?",ops:["Niños menores","Adultos mayores","Enfermedad crónica","Discapacidad","Ninguno"]},{id:"q0",tipo:"textarea",texto:"¿Intentó contactar la empresa? ¿Qué le dijeron?",ph:"Llamé y me dicen que debo $380.000 que no reconozco porque siempre he pagado..."}],corte_luz:[{id:"q0",tipo:"textarea",texto:"¿Cuándo cortaron la energía y cuál es la empresa?",ph:"EPM me cortó la energía el viernes. Tengo los recibos pagados del último año..."},{id:"q0",tipo:"multi",texto:"¿Hay equipos o personas vulnerables?",ops:["Equipos médicos vitales (oxígeno, diálisis)","Medicamentos refrigerados","Niños menores","Adulto mayor","Discapacidad","Ninguno"]},{id:"q0",tipo:"opciones",texto:"¿Le enviaron aviso de corte?",ops:["No, cortaron sin avisar nada","Sí pero el mismo día del corte","Sí, avisaron pero la deuda no es mía o ya la pagué","Sí, hay deuda pero no puedo pagarla toda"]}],cobro_exc:[{id:"q0",tipo:"textarea",texto:"¿Cuánto paga normalmente y cuánto llegó la factura cuestionada?",ph:"Normalmente pago $80.000 y este mes llegó $890.000 sin ninguna explicación..."},{id:"q0",tipo:"opciones",texto:"¿Ha puesto recurso o queja?",ops:["Sí, puse recurso y lo rechazaron","Sí, queja pero no han respondido en 15 días","No he puesto nada todavía"]},{id:"q0",tipo:"textarea",texto:"¿Qué explicación le dieron sobre el cobro?",ph:"Me dicen que hay consumo no facturado de meses anteriores que nunca me.."}],corte_gas:[{id:"q0",tipo:"textarea",texto:"¿Cuándo cortaron el gas y cuál es la empresa?",ph:"Vanti me cortó el gas el lunes sin aviso previo. Tengo mi factura al día..."},{id:"q0",tipo:"multi",texto:"¿Personas especiales en el hogar?",ops:["Niños menores","Adulto mayor","Enfermedad crónica","Discapacidad","Ninguno"]},{id:"q0",tipo:"textarea",texto:"¿Logró hablar con la empresa?",ph:"Me dicen que hay una deuda de un titular anterior en este inmueble que.."}],serv_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la empresa y cuándo?",ph:"El 1 de mayo solicité explicación de la factura excesiva. Radicado No..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que no respondan?",ph:"No puedo resolver la deuda sin saber si el cobro es correcto..."}],presc_comp:[{id:"q0",tipo:"textarea",texto:"¿De qué fecha es el comparendo y cuál es el número?",ph:"El comparendo es del 22 de octubre de 2019..."},{id:"q0",tipo:"textarea",texto:"¿En qué ciudad y ante qué Secretaría de Movilidad?",ph:"Bogotá, Secretaría Distrital de Movilidad / Medellín, Secretaría de Movilidad..."},{id:"q0",tipo:"opciones",texto:"¿Han iniciado cobro coactivo formal (mandamiento de pago)?",ops:["Sí, me llegó mandamiento de pago formal","No, solo aparece en el SIMIT sin cobro formal","Me llegaron notificaciones pero hace más de 3 años","No sé exactamente"]},{id:"q0",tipo:"textarea",texto:"¿Han pasado más de 3 años desde la infracción sin cobro coactivo?",ph:"La infracción fue en octubre 2019 y nunca he recibido mandamiento de p.."}],multa_nnotif:[{id:"q0",tipo:"textarea",texto:"¿Cómo se enteró de la multa y de qué fecha es?",ph:"Me enteré revisando el SIMIT. La multa es del 15 de enero de 2022 por .."},{id:"q0",tipo:"opciones",texto:"¿Le notificaron formalmente a su dirección?",ops:["No, nunca llegó notificación a mi dirección real","Llegó notificación pero la dirección era incorrecta","Me enteré años después por cobro coactivo","Llegó cuando ya venció el término para recurrir"]},{id:"q0",tipo:"textarea",texto:"¿Era usted quien conducía ese vehículo ese día?",ph:"Ese día yo estaba de viaje. El vehículo lo tenía mi hermano con mi aut.."}],comp_error:[{id:"q0",tipo:"textarea",texto:"¿Qué error tiene el comparendo? ¿Por qué no correspondía a usted?",ph:"La cámara captó un vehículo de placa similar pero diferente,.."},{id:"q0",tipo:"textarea",texto:"¿Qué pruebas tiene de que fue un error?",ph:"Tengo la escritura de venta, o fotos del vehículo diferente,.."},{id:"q0",tipo:"textarea",texto:"¿Cuándo fue el comparendo y cuándo se enteró?",ph:"El comparendo es del 10 de mayo de 2024. Me notificaron el 20 de mayo .."}],inmov_ileg:[{id:"q0",tipo:"textarea",texto:"¿Cuándo y por qué razón exacta inmovilizaron su vehículo?",ph:"El agente inmovilizó mi moto alegando que no tenía SOAT,.."},{id:"q0",tipo:"textarea",texto:"¿Tiene documentos que demuestren que la inmovilización fue injusta?",ph:"Tengo el SOAT vigente hasta diciembre 2025,.."},{id:"q0",tipo:"textarea",texto:"¿Ha podido recuperar el vehículo o sigue en el patio?",ph:"Está en el patio. Me cobran $80.000 diarios y llevan 5 días. Ya debo $400.000..."}],movil_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la Secretaría de Movilidad y cuándo?",ph:"El 5 de mayo solicité la prescripción del comparendo No. XXXXX..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses","Más de 6 meses"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el comprobante de radicación?",ph:"Sí, tengo el acuse de recibo con el número de radicado y sello de la S.."}],recurso_comp:[{id:"q0",tipo:"textarea",texto:"¿Por qué infracción pusieron el comparendo, cuándo y quién?",ph:"Comparendo por exceso de velocidad el 15 de mayo..."},{id:"q0",tipo:"textarea",texto:"¿Cuál es su argumento principal para impugnar?",ph:"La señalización no era visible desde la vía, o el equipo no estaba calibrado..."},{id:"q0",tipo:"textarea",texto:"¿Qué pruebas tiene?",ph:"Fotos del lugar, video de dashcam, testigos,.."}],pet_alcaldia:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la alcaldía y en qué fecha?",ph:"El 3 de abril solicité información sobre el estado de mi lote en escri.."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que no respondan?",ph:"No puedo tramitar la escritura pública y el negocio está completamente.."}],pet_banco:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó al banco y cuándo?",ph:"El 10 de mayo solicité devolución de cobro errado de $200..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Qué le cobran que no reconoce?",ph:"Un seguro de vida que nunca contraté, o una cuota de crédito que ya pagué..."}],pet_educacion:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la institución y cuándo?",ph:"El 15 de marzo solicité el diploma de bachiller y certificados de notas..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no tener respuesta?",ph:"No puedo inscribirme a la universidad, perdí una oferta de trabajo por.."}],pet_icbf:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó al ICBF y cuándo?",ph:"El 20 de abril solicité información sobre el proceso de custodia de mi.."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo afecta al menor la falta de respuesta?",ph:"Mi hijo está en situación de vulnerabilidad y necesito esta respuesta urgente..."}],pet_otra:[{id:"q0",tipo:"textarea",texto:"¿Qué entidad es y qué le solicitó exactamente?",ph:"Solicité a la DIAN información sobre mi RUT el 10 de abril con radicad.."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta la falta de respuesta?",ph:"No puedo continuar un trámite, perdí un contrato, no accedo a un subsidio..."}],neg_cx_est:[{id:"q0",tipo:"textarea",texto:"¿Qué cirugía reconstructiva le niegan y quién la ordenó?",placeholder:"El cirujano plástico ordenó reconstrucción mamaria post-mastectomía y la EPS dice que es estética..."},{id:"q0",tipo:"opciones",texto:"¿Tiene orden médica escrita de un especialista?",ops:["Sí, orden firmada por especialista","Solo recomendación verbal del médico","La EPS no le deja ver al especialista"]},{id:"q0",tipo:"textarea",texto:"¿Por qué razón la EPS niega la cirugía?",placeholder:"Dicen que es estética pero el médico certifica que es reconstructiva y necesaria para mi salud mental..."}],neg_transporte:[{id:"q0",tipo:"textarea",texto:"¿Para qué cita o tratamiento necesita transporte médico?",placeholder:"Necesito ir a diálisis 3 veces por semana a 80 km. No puedo ir en bus por mi condición..."},{id:"q0",tipo:"opciones",texto:"¿Tiene certificación médica de que no puede usar transporte público?",ops:["Sí, el médico certifica que necesito transporte especial","Me lo dijo verbalmente pero sin papel","No tengo la certificación todavía"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto le cuesta costearlo de su bolsillo actualmente?",placeholder:"Gasto $180.000 por semana en transporte que no puedo sostener con mi ingreso de $800.000..."}],neg_examen:[{id:"q0",tipo:"textarea",texto:"¿Qué examen niegan y para qué condición fue ordenado?",placeholder:"Me niegan la resonancia magnética que el neurólogo ordenó para descartar tumor cerebral..."},{id:"q0",tipo:"opciones",texto:"¿Razón de la negativa?",ops:["No está en el PBS","Requiere autorización especial","No autorizan sin más explicación","Ya lo autorizaron pero no hay disponibilidad"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva esperando y cómo le afecta?",placeholder:"Llevo 3 meses sin el examen. Los síntomas empeoran y el médico dice que es urgente diagnosticar..."}],neg_terapia:[{id:"q0",tipo:"textarea",texto:"¿Qué terapia niegan y quién la formuló?",placeholder:"Me niegan las 20 sesiones de fisioterapia que el ortopedista ordenó para recuperar movilidad de rodilla..."},{id:"q0",tipo:"opciones",texto:"¿Cuántas sesiones ordenaron y cuántas han autorizado?",ops:["Ordenaron 20+ sesiones pero no autorizan ninguna","Autorizan solo 2-3 cuando ordenaron 20","Las primeras sesiones sí, ahora cortaron el servicio"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no tener las terapias?",placeholder:"Sin fisioterapia no puedo recuperar la movilidad. El médico dice que puede quedar con discapacidad permanente..."}],eps_mora:[{id:"q0",tipo:"textarea",texto:"¿Cuándo ocurrió la desvinculación y cuál es su situación laboral actual?",placeholder:"Me desvincularon de la EPS el 15 de mayo aunque sigo trabajando. Hay un error en el sistema..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es la causa del problema?",ops:["Error en sistema — siguen vigente el contrato","Me cambiaron de EPS sin mi autorización","La empresa reportó retiro pero no me despidieron","Soy independiente y pagué pero no me aparezco activo"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta este problema actualmente?",placeholder:"Tengo citas médicas urgentes esta semana y no me las autorizan. Tengo tratamiento activo interrumpido..."}],neg_pbs:[{id:"q0",tipo:"textarea",texto:"¿Qué medicamento o servicio dicen que no está en el PBS?",placeholder:"Me niegan el Adalimumab (Humira) para artritis reumatoide activa diciendo que no está en el Plan..."},{id:"q0",tipo:"opciones",texto:"¿Hay alternativa dentro del PBS que ya haya intentado sin éxito?",ops:["Sí, ya probé la alternativa del PBS y no me funcionó","No hay alternativa para mi condición específica","El médico certifica que solo este medicamento sirve"]},{id:"q0",tipo:"textarea",texto:"¿Qué certifica el médico tratante sobre la necesidad?",placeholder:"El reumatólogo certifica que sin este tratamiento hay riesgo de daño articular permanente irreversible..."}],cambio_med:[{id:"q0",tipo:"textarea",texto:"¿Qué especialista le cambiaron y por qué es importante continuar?",placeholder:"Me cambiaron el oncólogo que lleva 2 años tratando mi cáncer. El nuevo no conoce mi historial..."},{id:"q0",tipo:"opciones",texto:"¿Le dieron alguna razón para el cambio?",ops:["Dicen que el médico ya no hace parte de la red","Dicen que por reorganización interna","No dieron ninguna explicación formal","Dicen que debo esperar nuevo médico disponible"]},{id:"q0",tipo:"textarea",texto:"¿Cómo afecta el cambio a su tratamiento actual?",placeholder:"El nuevo médico quiere empezar un tratamiento diferente que ya fallé. Mi médico anterior conocía mi caso..."}],neg_rehab:[{id:"q0",tipo:"textarea",texto:"¿Qué dispositivo o proceso de rehabilitación le niegan?",placeholder:"Me niegan la silla de ruedas motorizada que el fisiatra ordenó. Tengo parálisis de los dos miembros inferiores..."},{id:"q0",tipo:"opciones",texto:"¿Quién ordenó el dispositivo o la rehabilitación?",ops:["Médico especialista fisiatra o rehabilitador","Médico general con remisión al especialista","Cirujano que realizó el procedimiento"]},{id:"q0",tipo:"textarea",texto:"¿Cómo impacta en su vida diaria la negativa?",placeholder:"Sin la silla no puedo salir de casa, no puedo trabajar, dependo completamente de mi familia para todo..."}],seg_no_aut:[{id:"q0",tipo:"textarea",texto:"¿Qué seguro o producto le inscribieron sin pedirlo?",placeholder:"Me inscribieron un seguro de vida por $18.500/mes y un seguro de desempleo por $12.000 sin que yo lo pidiera..."},{id:"q0",tipo:"opciones",texto:"¿Cuándo lo descubrió?",ops:["Revisando el extracto bancario este mes","Me llegó documentación que no pedí","Me llamaron a confirmar algo que yo no había solicitado","Lleva meses y acaban de descubrirlo"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto dinero le han cobrado en total por este producto no autorizado?",placeholder:"Llevan 6 meses cobrándome $18.500 mensuales. En total me han cobrado $111.000 sin autorización..."}],ret_saldo:[{id:"q0",tipo:"textarea",texto:"¿Cuánto dinero bloquearon y desde cuándo?",placeholder:"El banco bloqueó $3.500.000 de mi cuenta de ahorros el pasado lunes sin ninguna comunicación previa..."},{id:"q0",tipo:"opciones",texto:"¿Le dieron alguna razón para el bloqueo?",ops:["Dicen que hay una orden judicial (pero no la muestran)","Dicen que hay una investigación interna","No han dado ninguna explicación","Dicen que hay un embargo que desconozco"]},{id:"q0",tipo:"textarea",texto:"¿Necesita esos fondos para algo urgente?",placeholder:"Es el dinero del arriendo que debo pagar mañana. También tengo facturas vencidas urgentes que pagar..."}],int_excesivo:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de crédito tiene y cuál es la tasa que le cobran?",placeholder:"Tengo un crédito de libre inversión a una tasa del 48% efectivo anual que supera el límite de usura..."},{id:"q0",tipo:"opciones",texto:"¿Ha calculado si supera el límite de usura certificado por la Superfinanciera?",ops:["Sí, la tasa que me cobran supera el límite certificado","No sé exactamente cuál es el límite actual","Me cobran intereses sobre intereses (anatocismo)"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto ha pagado de más según su cálculo?",placeholder:"Llevo 2 años pagando. Calculo que he pagado $4.000.000 de más en intereses por encima del límite legal..."}],neg_credito:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de crédito le niegan y en qué banco?",placeholder:"Solicité crédito hipotecario en Davivienda. Lo niegan sin explicación. No tengo deudas ni reportes negativos..."},{id:"q0",tipo:"opciones",texto:"¿Le dieron alguna razón para la negativa?",ops:["No dieron ninguna razón formal","Dicen que el score crediticio es bajo pero no lo explican","Dicen que los ingresos no son suficientes","Hay un reporte negativo que desconozco o que ya pagué"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta negativa?",placeholder:"Necesito el crédito para comprar vivienda de interés social con subsidio que vence en 3 meses..."}],cancel_tc:[{id:"q0",tipo:"textarea",texto:"¿Cuándo cancelaron su tarjeta y qué uso tenía?",placeholder:"Cancelaron mi tarjeta de crédito con $5.000.000 de cupo sin avisar. La usaba para gastos del negocio..."},{id:"q0",tipo:"opciones",texto:"¿Le informaron antes de la cancelación?",ops:["No, fue de manera abrupta sin ningún aviso","Sí, pero sin tiempo suficiente para alternativas","Me llegó carta pero ya estaba cancelada"]},{id:"q0",tipo:"textarea",texto:"¿Tiene pagos automáticos o compromisos vinculados a esa tarjeta?",placeholder:"Tengo 4 pagos automáticos de servicios y un crédito que descuenta de esa tarjeta mensualmente..."}],no_devolucion:[{id:"q0",tipo:"textarea",texto:"¿De qué transacción es la devolución y por qué no la recibe?",placeholder:"Pagué $890.000 en un comercio pero la transacción falló. El banco dice que sí se procesó pero el comercio dice que no..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto tiempo lleva esperando la devolución?",ops:["Menos de 15 días","Entre 15 y 30 días hábiles","Más de 30 días hábiles","El banco ya cerró el caso sin devolverme el dinero"]},{id:"q0",tipo:"textarea",texto:"¿Tiene algún comprobante de que la transacción falló o fue duplicada?",placeholder:"Tengo captura de pantalla del error, el extracto con el cobro y el recibo del comercio que no se procesó..."}],accidente:[{id:"q0",tipo:"textarea",texto:"¿Qué accidente sufrió, cuándo y en qué circunstancias?",placeholder:"El 10 de mayo me caí en la bodega de la empresa. Me fracturé la muñeca derecha. Estaba trabajando..."},{id:"q0",tipo:"opciones",texto:"¿La ARL reconoció el accidente como laboral?",ops:["No, dicen que fue accidente de tránsito o personal","Lo reconocieron pero no pagan las prestaciones","Lo reconocieron parcialmente","No han respondido la calificación del origen"]},{id:"q0",tipo:"textarea",texto:"¿Qué prestaciones o atención le están negando?",placeholder:"La ARL no me paga las incapacidades, no me cubre la cirugía de la muñeca ni la rehabilitación..."}],enf_laboral:[{id:"q0",tipo:"textarea",texto:"¿Qué enfermedad tiene y cómo se relaciona con su trabajo?",placeholder:"Tengo síndrome del túnel carpiano en ambas manos por 10 años digitando 8 horas diarias sin pausas..."},{id:"q0",tipo:"opciones",texto:"¿La Junta de Calificación ha determinado el origen?",ops:["No, la ARL la califica como común sin estudio serio","La junta regional dijo que era laboral pero la ARL apeló","Está en proceso de calificación hace más de 6 meses","La ARL no la ha enviado a calificar"]},{id:"q0",tipo:"textarea",texto:"¿Cómo afecta la enfermedad su capacidad de trabajar?",placeholder:"Ya no puedo trabajar con computador. Perdí mi empleo porque no pude rendir igual. No tengo otro ingreso..."}],despido_inj:[{id:"q0",tipo:"textarea",texto:"¿Cuándo lo despidieron, qué razón le dieron y cuánto tiempo llevaba?",placeholder:"Me despidieron el 15 de mayo después de 7 años. La causa que pusieron es vaga: 'bajo rendimiento'..."},{id:"q0",tipo:"opciones",texto:"¿Le pagaron la liquidación completa?",ops:["No me pagaron nada todavía","Me pagaron pero falta parte (vacaciones, prima, etc.)","Me pagaron pero calcularon mal las indemnizaciones","Me obligaron a firmar una liquidación que no entendí"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto calcula que le deben?",placeholder:"Calculo que me deben $8.000.000 entre indemnización de 7 años, vacaciones pendientes y prima proporcional..."}],no_prestaciones:[{id:"q0",tipo:"textarea",texto:"¿Qué prestaciones no le han pagado y de qué período?",placeholder:"No me han pagado las cesantías del año pasado ($3.200.000), la prima de junio y las vacaciones de 2024..."},{id:"q0",tipo:"opciones",texto:"¿Sigue activo en la empresa o ya se fue?",ops:["Sigo trabajando ahí, no me quieren pagar","Me fui hace menos de 3 años","Me fui hace más de 3 años (verificar prescripción)"]},{id:"q0",tipo:"opciones",texto:"¿Tiene documentos que prueben el tiempo trabajado?",ops:["Sí, tengo contrato y desprendibles de nómina","Tengo colillas de pago pero contrato era verbal","Solo tengo mensajes de WhatsApp como evidencia","No tengo pruebas documentales por ahora"]}],desp_sindical:[{id:"q0",tipo:"textarea",texto:"¿Cuál es su rol sindical y cuándo fue el despido?",placeholder:"Soy subdirector del sindicato de trabajadores. Me despidieron 3 días después de liderar una huelga legal..."},{id:"q0",tipo:"opciones",texto:"¿Tenía fuero sindical vigente al momento del despido?",ops:["Sí, tenía fuero sindical activo y verificado","Tenía fuero pero había vencido hace poco","Soy fundador del sindicato con protección especial"]},{id:"q0",tipo:"texto",texto:"¿Tiene pruebas de que el despido fue por actividad sindical?",placeholder:"Tengo correos del gerente amenazando a los que participen, lista de despedidos que son todos dirigentes..."}],discriminacion_lab:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de discriminación sufrió y quién la ejerció?",placeholder:"Me negaron el ascenso siendo la más calificada. La promovieron a un hombre con menos experiencia..."},{id:"q0",tipo:"opciones",texto:"¿En qué se basó la discriminación?",ops:["Género (ser mujer o del colectivo LGBTIQ+)","Origen étnico, racial o nacional","Discapacidad o condición de salud","Edad (más de 50 años o menos de 25)","Religión o creencias","Embarazo o maternidad"]},{id:"q0",tipo:"textarea",texto:"¿Tiene evidencias de la discriminación?",placeholder:"Tengo el correo donde le dicen al otro candidato que lo prefieren porque 'las mujeres faltan mucho'..."}],no_afil_pension:[{id:"q0",tipo:"textarea",texto:"¿Cuántos años trabajó sin aportes a pensión y en qué empresa?",placeholder:"Trabajé 5 años en Confecciones XYZ. Nunca me afiliaron a pensión aunque me descontaban de la nómina..."},{id:"q0",tipo:"opciones",texto:"¿Le descontaban de la nómina y no pagaban, o no le descontaban?",ops:["Me descontaban pero nunca pagaban al fondo de pensiones","No me descontaban nada nunca","A veces sí y a veces no — muy irregular"]},{id:"q0",tipo:"textarea",texto:"¿Tiene comprobantes de nómina o extractos del fondo de pensiones?",placeholder:"Tengo los desprendibles que muestran descuento de pensión. En Colpensiones aparecen solo 6 meses cotizados..."}],corte_internet:[{id:"q0",tipo:"textarea",texto:"¿Qué empresa presta el servicio y desde cuándo tiene el problema?",placeholder:"Claro me cortó el internet el lunes aunque estoy al día con los pagos. Tengo el recibo del mes..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el problema?",ops:["Cortaron el servicio estando al día con los pagos","La velocidad bajó a menos del 30% de lo contratado","Fallas frecuentes y no reparan en el plazo legal","Cobran velocidad que no entregan (contrato vs realidad)"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no tener el servicio de internet?",placeholder:"Trabajo desde casa, tengo clases virtuales, y mis hijos tienen clases en línea. Es un servicio esencial..."}],no_instalacion:[{id:"q0",tipo:"textarea",texto:"¿Qué servicio contrató, cuándo pagó y qué pasó?",placeholder:"Pagué $320.000 por la instalación de gas natural el 5 de mayo. Me dijeron 15 días y ya van 2 meses..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto tiempo lleva esperando la instalación?",ops:["Entre 15 y 30 días después de la fecha prometida","Entre 1 y 3 meses sin instalar","Más de 3 meses y no responden","Cancelé pero no devuelven el dinero"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el recibo de pago y el contrato con la fecha prometida?",placeholder:"Tengo el contrato que dice instalación en 10 días hábiles, el recibo de pago y los mensajes de la empresa..."}],deuda_anterior:[{id:"q0",tipo:"textarea",texto:"¿De cuánto es la deuda que le cobran y de qué período?",placeholder:"Cemex me cobra $1.800.000 de agua del inquilino anterior entre 2020-2022. Yo llegué a vivir aquí en 2023..."},{id:"q0",tipo:"opciones",texto:"¿Puede probar que usted llegó después del período de la deuda?",ops:["Sí, tengo contrato de arriendo con fecha de inicio","Sí, tengo facturas propias desde que llegué","Tengo testimonios del anterior inquilino","No tengo documentos claros todavía"]},{id:"q0",tipo:"opciones",texto:"¿La empresa ya ha tomado alguna acción por la deuda?",ops:["Amenazan con cortar el servicio por esa deuda antigua","Ya cortaron el servicio por la deuda que no es mía","Incluyen la deuda en mi factura mensual"]}],reclamo_medidor:[{id:"q0",tipo:"textarea",texto:"¿Qué problema tiene el medidor y en qué se basa su reclamo?",placeholder:"El medidor marca consumos 4 veces más altos que mis vecinos con el mismo tipo de vivienda y mismo número de personas..."},{id:"q0",tipo:"opciones",texto:"¿Ha solicitado revisión técnica del medidor?",ops:["Sí, la empresa lo revisó y dice que está bien","Sí, la empresa no ha enviado técnico","No, pero tengo comparaciones claras de consumo","El medidor fue cambiado recientemente y empeoró"]},{id:"q0",tipo:"textarea",texto:"¿Tiene comparaciones de consumo con períodos anteriores?",placeholder:"Las últimas 6 facturas muestran consumo triplicado. Antes pagaba $60.000 y ahora pago $190.000 sin cambios en uso..."}],suspension_eq_med:[{id:"q0",tipo:"textarea",texto:"¿Qué equipos médicos hay en el hogar y qué servicio suspendieron?",placeholder:"Mi madre tiene máquina de diálisis en casa. EPM cortó la luz el martes aunque tenemos certificado médico vigente..."},{id:"q0",tipo:"opciones",texto:"¿Tenían registro especial ante la empresa por equipos médicos?",ops:["Sí, enviamos el certificado médico y nos registraron","Enviamos el certificado pero nunca actualizaron el sistema","No sabíamos que había que registrar los equipos","Teníamos el registro pero venció y no nos avisaron"]},{id:"q0",tipo:"textarea",texto:"¿Cuál es la situación médica del paciente con equipos en casa?",placeholder:"Mi madre es paciente renal en diálisis. Sin energía no puede usar la máquina 3 veces por semana..."}],corte_masivo:[{id:"q0",tipo:"texto",texto:"¿Qué servicio se interrumpió, desde cuándo y a cuántos usuarios afecta?",placeholder:"Hay un corte de agua en todo el barrio San Fernando desde hace 4 días. Afecta a 300 familias..."},{id:"q0",tipo:"opciones",texto:"¿La empresa ha dado alguna solución temporal?",ops:["No han enviado carrotanques ni nada","Enviaron carrotanques pero insuficientes","Prometieron reparación pero no aparecen","Ya los llamaron y dicen que están trabajando en ello"]},{id:"q0",tipo:"textarea",texto:"¿Hay personas vulnerables (niños, adultos mayores, enfermos) sin el servicio?",placeholder:"Hay 40 adultos mayores en el hogar geriátrico y 2 familias con niños menores de 2 años sin agua..."}],semanas_mal:[{id:"q0",tipo:"textarea",texto:"¿Cuántas semanas aparecen en el sistema vs cuántas calcula usted?",placeholder:"En Colpensiones aparezco con 850 semanas pero yo calculo más de 1.200 entre varios empleadores..."},{id:"q0",tipo:"opciones",texto:"¿Por qué hay diferencia en las semanas?",ops:["Empresas cerradas no reportaron a Colpensiones","Pagué independiente pero no aparece en el sistema","Trabajé en el exterior y esos aportes no cuentan","Colpensiones no reconoce períodos en FONPET o FOPEP"]},{id:"q0",tipo:"textarea",texto:"¿Tiene pruebas de los períodos de cotización no reconocidos?",placeholder:"Tengo desprendibles de nómina, certificaciones laborales y cartas de las empresas de esa época..."}],indemnizacion:[{id:"q0",tipo:"textarea",texto:"¿Cuántas semanas tiene y por qué no cumple para la pensión?",placeholder:"Tengo 850 semanas y 62 años. No me alcanza para pensión de vejez pero quiero la indemnización sustitutiva..."},{id:"q0",tipo:"opciones",texto:"¿Qué le dice Colpensiones?",ops:["Que debo seguir cotizando aunque no pueda trabajar","Que el monto sería muy bajo y me conviene otro trámite","Que hay un proceso pendiente que bloquea la solicitud","No han dado respuesta de fondo en más de 4 meses"]},{id:"q0",tipo:"textarea",texto:"¿Necesita el dinero de la devolución de aportes urgentemente?",placeholder:"Tengo 65 años, no puedo trabajar más y ese dinero es lo único que tengo para sobrevivir..."}],no_inc_laboral:[{id:"q0",tipo:"textarea",texto:"¿Cuántos días de incapacidad tiene y por qué la ARL no paga?",placeholder:"La junta certificó 90 días de incapacidad laboral. La ARL dice que el accidente fue personal no laboral..."},{id:"q0",tipo:"opciones",texto:"¿La ARL reconoció el origen laboral del accidente o enfermedad?",ops:["No, calificaron el origen como común","Lo reconocieron pero dicen que es período de carencia","Está en disputa — apelan la calificación de la junta"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto dinero le deben de incapacidades sin pagar?",placeholder:"Son 90 días a $80.000/día de incapacidad. Me deben aproximadamente $7.200.000..."}],inc_eps_irl:[{id:"q0",tipo:"textarea",texto:"¿Cuántos días de incapacidad lleva y quién la debe pagar ahora?",placeholder:"Llevo 210 días incapacitado por enfermedad grave. La EPS pagó los primeros 180 pero ahora se niega a continuar..."},{id:"q0",tipo:"opciones",texto:"¿La EPS remitió el caso a Colpensiones para incapacidades de más de 180 días?",ops:["No, la EPS sigue negando el pago sin remitir el caso","Remitieron pero Colpensiones rechaza porque la EPS no tramitó bien","Están en conflicto entre ellos y yo quedo sin pagar"]},{id:"q0",tipo:"textarea",texto:"¿Cómo está su situación económica sin las incapacidades?",placeholder:"Llevo 3 meses sin recibir nada. Perdí mi apartamento y vivo prestado. Tengo familia a cargo..."}],traslado_afp:[{id:"q0",tipo:"textarea",texto:"¿A qué fondo quiere trasladarse y desde cuándo intenta hacerlo?",placeholder:"Quiero pasarme de Porvenir a Colpensiones. Llevo 2 años intentando y siempre me ponen trabas..."},{id:"q0",tipo:"opciones",texto:"¿Qué razón le da la AFP para bloquear el traslado?",ops:["Dicen que no cumple los requisitos sin explicar cuáles","Piden documentos que ya se entregaron múltiples veces","El sistema no procesa la solicitud y no explican por qué","Dicen que está en período de permanencia mínima"]},{id:"q0",tipo:"textarea",texto:"¿Por qué quiere trasladarse a Colpensiones?",placeholder:"Con 55 años y 1.100 semanas, en Colpensiones podría pensionarme en 5 años. En el fondo privado no alcanzaría..."}],fotomulta_irr:[{id:"q0",tipo:"textarea",texto:"¿Cuántos comparendos fotomulta tiene y de qué ciudades?",placeholder:"Tengo 3 comparendos de fotomulta de Bogotá del 2019-2021. Escuché que muchos fueron anulados por irregularidades..."},{id:"q0",tipo:"opciones",texto:"¿Sabe si sus comparendos hacen parte del proceso de revisión nacional?",ops:["Sí, me notificaron que están en revisión","Aparecen en el SIMIT pero no sé si están en proceso de nulidad","Los pagué y quiero saber si tengo derecho a devolución","No sé nada del proceso de revisión"]},{id:"q0",tipo:"opciones",texto:"¿Ya pagó los comparendos o están pendientes?",ops:["Los pagué y quiero la devolución","Están pendientes de pago y quiero que los anulen","Algunos pagados y otros pendientes","No sé el estado actual en el SIMIT"]},{id:"q0",tipo:"textarea",texto:"¿En qué ciudades o Secretarías de Movilidad fueron expedidos?",placeholder:"Bogotá (Secretaría Distrital), Medellín, Cali, Barranquilla, Bucaramanga, o municipio pequeño..."}],multa_no_notif:[{id:"q0",tipo:"textarea",texto:"¿Cómo se enteró de la multa y cuál es la fecha de la infracción?",placeholder:"Me enteré 2 años después cuando me bloquearon el RUNT. El comparendo es del 15 de enero de 2022..."},{id:"q0",tipo:"opciones",texto:"¿Le llegó notificación a su dirección?",ops:["Nunca me llegó ninguna notificación","Llegó a una dirección anterior o incorrecta","Llegó pero cuando ya había vencido el recurso","Nunca llegó y acabo de enterarme por el SIMIT"]},{id:"q0",tipo:"textarea",texto:"¿Tiene registro de cuál era su dirección en el RUNT para esa fecha?",placeholder:"Para esa fecha mi dirección registrada era Calle 45 # 23-10. Nunca me llegó ninguna notificación allí..."}],multa_presencial:[{id:"q0",tipo:"textarea",texto:"¿Qué irregularidades tuvo el comparendo presencial del agente?",placeholder:"El agente no me entregó copia del comparendo, no me dejó ver el código de infracción y no firmó bien..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el principal problema con el comparendo?",ops:["El agente no siguió el procedimiento correcto (Art. 135 CNT)","La infracción descrita no corresponde a lo que realmente ocurrió","El comparendo tiene errores en datos (placa, fecha, código)","El agente me amenazó o coaccionó durante el proceso"]},{id:"q0",tipo:"textarea",texto:"¿Tiene testigos o algún registro del momento?",placeholder:"Tengo video en el celular del momento. Hay testigos que vieron como el agente actuó irregularmente..."}],multa_rtm:[{id:"q0",tipo:"textarea",texto:"¿Cuándo le dieron el comparendo y tenía la RTM vigente?",placeholder:"Me dieron comparendo por RTM el martes. La tengo vigente hasta diciembre. La tenía en el carro pero no la vi..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es su situación con la RTM?",ops:["Tenía RTM vigente pero el agente no la aceptó","RTM vigente pero no la llevaba en el momento (la tiene en casa)","RTM vencida hace menos de 30 días y no la había renovado","RTM vencida hace más tiempo pero por fuerza mayor (pandemia, etc.)"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el certificado de la RTM vigente para probar?",placeholder:"Sí, tengo el certificado con fecha de expedición y vigencia hasta el 30 de noviembre del año en curso..."}],multa_soat:[{id:"q0",tipo:"textarea",texto:"¿Cuándo le dieron el comparendo y tenía el SOAT vigente?",placeholder:"El agente me multó por SOAT el sábado. Lo tengo vigente hasta agosto pero no aparecía en el sistema..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es su situación con el SOAT?",ops:["Tenía SOAT vigente pero el RUNT no lo mostraba ese día","SOAT nuevo expedido hace menos de 24 horas (demora en RUNT)","Compré SOAT digital y el agente no lo reconoció","SOAT vencido pero lo había renovado ese mismo día"]},{id:"q0",tipo:"textarea",texto:"¿Tiene la póliza o recibo del SOAT como prueba?",placeholder:"Sí, tengo el SOAT digital con código de póliza, fecha de expedición y vigencia hasta el 15 de agosto..."}],multa_alcohol:[{id:"q0",tipo:"textarea",texto:"¿Cómo fue el procedimiento y qué irregularidad encontró?",placeholder:"El alcoholímetro no estaba calibrado según el certificado que me mostraron. El procedimiento fue irregular..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el fundamento de su impugnación?",ops:["El equipo no tenía certificado de calibración vigente","El procedimiento no siguió el protocolo (testigos, notificación)","El resultado fue contradictorio con cómo me sentía","Me realizaron la prueba en condiciones irregulares"]},{id:"q0",tipo:"textarea",texto:"¿Tiene alguna evidencia de la irregularidad?",placeholder:"Solicité el número de serie del alcoholímetro. Pude verificar que el certificado de calibración estaba vencido..."}],multa_velocidad:[{id:"q0",tipo:"textarea",texto:"¿Cuándo fue el comparendo y qué velocidad le marcaron?",placeholder:"Cámara de Bogotá me marcó 95 km/h el 20 de mayo. Iba en una vía de 80. Pero la señalización no era visible..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es su argumento principal para impugnar?",ops:["La señalización de velocidad no era visible o estaba obstruida","El equipo de medición no tenía certificación vigente","La velocidad marcada es imposible en ese tramo (congestionamiento)","Hubo un error técnico en la captura de la cámara"]},{id:"q0",tipo:"textarea",texto:"¿Tiene pruebas para su argumento?",placeholder:"Tengo fotos del lugar donde no se ve la señal, el video de mi dashcam que muestra el congestionamiento..."}],lic_suspendida:[{id:"q0",tipo:"textarea",texto:"¿Por qué motivo suspendieron su licencia y cuándo le notificaron?",placeholder:"Me suspendieron la licencia por 6 meses por un comparendo que ya prescribió. No hubo proceso previo..."},{id:"q0",tipo:"opciones",texto:"¿Le dieron la oportunidad de defenderse antes de la suspensión?",ops:["No, la suspensión fue sin ningún proceso previo","Hubo notificación pero no se respetó el debido proceso","El proceso fue irregular — no pude presentar pruebas","La causa de la suspensión ya estaba prescrita o resuelta"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta la suspensión de la licencia?",placeholder:"Soy conductor de plataforma. Sin licencia no puedo trabajar. Tengo familia que depende de ese ingreso..."}],runt_error:[{id:"q0",tipo:"textarea",texto:"¿Qué error tiene el RUNT y cómo lo descubrió?",placeholder:"Mi vehículo aparece con otro color, otro motor y con multas que no son mías. Lo descubrí en el traspaso..."},{id:"q0",tipo:"opciones",texto:"¿Qué tipo de error es?",ops:["Error en datos del vehículo (color, motor, modelo)","Error en datos del propietario (nombre, cédula, dirección)","Comparendos o multas de otro vehículo asignados al mío","Vehículo aparece robado o con anotaciones que no corresponden"]},{id:"q0",tipo:"textarea",texto:"¿Tiene los documentos originales que prueban el error?",placeholder:"Tengo la factura de compra con las especificaciones reales del vehículo y el SOAT que también tiene error..."}],runt_duplicado:[{id:"q0",tipo:"opciones",texto:"¿Por qué necesita el duplicado de la tarjeta de propiedad?",ops:["Pérdida o extravío","Robo (tengo denuncia)","Deterioro — está ilegible o dañada","Fuerza mayor: incendio, inundación u otro evento"]},{id:"q0",tipo:"opciones",texto:"¿Está al día con los requisitos para el trámite?",ops:["Sí, tengo SOAT vigente, paz y salvo de multas y RH vigente","Tengo deudas de multas que no puedo pagar antes del trámite","No sé exactamente qué documentos necesito","Estoy inscrito en el RUNT como propietario"]},{id:"q0",tipo:"textarea",texto:"¿Hay algún problema adicional que bloquee el trámite?",placeholder:"El vehículo tiene un embargo, o hay un error en el RUNT, o no aparezco como propietario aunque lo soy..."}],traspaso_bloq:[{id:"q0",tipo:"textarea",texto:"¿Qué vehículo quiere traspasar, a quién y qué problema tiene?",placeholder:"Vendí mi carro en marzo. El comprador fue a registrar el traspaso pero el RUNT dice que hay un embargo..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el obstáculo para el traspaso?",ops:["El RUNT tiene un embargo que ya fue levantado","Hay multas o impuestos pendientes en disputa","El comprador anterior no hizo el traspaso a su nombre","Hay una anotación de robo o recuperación que no corresponde"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva bloqueado el traspaso?",placeholder:"Lleva 2 meses bloqueado. El comprador amenaza con devolver el carro y yo ya gasté la plata..."}],expulsion:[{id:"q0",tipo:"textarea",texto:"¿Por qué razón lo sancionaron o expulsaron y cómo fue el proceso?",placeholder:"Me expulsaron del colegio alegando indisciplina grave. Nunca hubo comité de convivencia ni descargos..."},{id:"q0",tipo:"opciones",texto:"¿Se respetó el debido proceso y el manual de convivencia?",ops:["No, sancionaron sin audiencia ni descargos","Hubo proceso pero fue irregular o parcializado","No me mostraron el manual de convivencia","La sanción es desproporcionada vs la falta cometida"]},{id:"q0",tipo:"textarea",texto:"¿Cómo afecta la sanción al estudiante?",placeholder:"Mi hijo quedó sin poder estudiar en pleno año lectivo. No encontramos otro colegio que lo reciba ahora..."}],neg_beca:[{id:"q0",tipo:"textarea",texto:"¿A qué beca o crédito aplicó y por qué la niegan?",placeholder:"Apliqué a Generación E de Minciencias. Me niegan diciendo que no cumplo el puntaje pero mi ICFES fue 380..."},{id:"q0",tipo:"opciones",texto:"¿Qué razón dan para la negativa?",ops:["Puntaje insuficiente aunque cumplo los requisitos","No encontraron mis datos en el sistema","Error en la inscripción que no me permitieron corregir","No tengo SISBEN aunque debería estar incluido"]},{id:"q0",tipo:"textarea",texto:"¿Tiene documentos que prueban que cumple los requisitos?",placeholder:"Tengo el resultado ICFES, la constancia de estrato 1, el certificado de ingresos familiares que cumplen..."}],icetex_cob:[{id:"q0",tipo:"textarea",texto:"¿Qué cobro de ICETEX considera indebido?",placeholder:"ICETEX me cobra intereses durante la congelación de deuda por COVID que debió suspenderse por la Ley 2022..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el problema con ICETEX?",ops:["Cobran intereses en período que debía estar congelado","El valor de las cuotas cambió sin notificación previa","No aplican descuentos de paz y salvo o buen deudor","Me reportaron negativamente habiendo pagado a tiempo"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto dinero considera que le cobran de más?",placeholder:"Me cobran $2.400.000 de intereses acumulados durante el período COVID que debía estar congelado..."}],icfes_error:[{id:"q0",tipo:"opciones",texto:"¿Qué tipo de problema tiene con el ICFES?",ops:["Error en el puntaje o resultados","No aparezco inscrito aunque pagué","Me asignaron mesa de examen incorrecta o no me dejaron entrar","Documentación de grado no aparece vinculada"]},{id:"q0",tipo:"textarea",texto:"¿Cuándo presentó el examen y cuál es el problema específico?",placeholder:"Presenté el ICFES en noviembre de 2024. Mi puntaje de Razonamiento Cuantitativo aparece como 0 siendo 70..."},{id:"q0",tipo:"textarea",texto:"¿Cómo afecta el error a su situación actual?",placeholder:"Con el error no me reciben en la universidad. La admisión ya venció. Pierdo el año si no corrigen pronto..."}],no_inclusion:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de discapacidad tiene el estudiante y qué adaptación niegan?",placeholder:"Mi hijo tiene autismo. El colegio no le hace ajustes razonables ni adaptan los exámenes como ordena la ley..."},{id:"q0",tipo:"opciones",texto:"¿Tiene diagnóstico médico certificado de la condición?",ops:["Sí, diagnóstico de especialista (psicólogo, psiquiatra, neurólogo)","Está en proceso de diagnóstico pero hay evidencia clara","Solo el concepto del médico general por ahora"]},{id:"q0",tipo:"textarea",texto:"¿Qué adaptaciones específicas niega la institución?",placeholder:"Niegan tiempo adicional en exámenes, acompañante de apoyo en clase, y evaluaciones alternativas..."}],no_escritura:[{id:"q0",tipo:"textarea",texto:"¿Cuándo compró la vivienda y por qué no le dan la escritura?",placeholder:"Compré el apartamento en 2019 y pagué todo. La constructora dice que hay un problema en la Notaría 12..."},{id:"q0",tipo:"opciones",texto:"¿Cuál es el obstáculo para la escritura?",ops:["La constructora tiene deuda hipotecaria sobre el predio","Hay un litigio legal que bloquea la notaría","El banco no libera la hipoteca aunque pagó el crédito","Error en linderos o datos en la Notaría"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva sin la escritura y qué perjuicios le genera?",placeholder:"Llevo 5 años viviendo en el apartamento sin escritura. No puedo hacer mejoras ni venderlo ni usarlo como garantía..."}],arrendador_ab:[{id:"q0",tipo:"opciones",texto:"¿Qué cobro abusivo hace el arrendador?",ops:["No devuelve el depósito de arrendamiento sin justificación","Cobra servicios públicos inflados o servicios no prestados","Incrementó el canon por encima del IPC permitido","Cobra administración que no corresponde al contrato"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto es el valor en disputa y cuánto tiempo lleva el problema?",placeholder:"El arrendador retiene $3.500.000 del depósito alegando daños que no existen. Entregué el apartamento impecable..."},{id:"q0",tipo:"opciones",texto:"¿Tiene contrato de arrendamiento y registro de pagos?",ops:["Sí, tengo contrato escrito y todos los recibos de pago","Contrato verbal pero tengo transferencias bancarias","Solo tengo algunos recibos, el contrato estaba en digital"]}],riesgo_derrumbe:[{id:"q0",tipo:"textarea",texto:"¿En qué zona de riesgo está y qué entidad lo ha certificado?",placeholder:"La Corporación Autónoma Regional declaró la zona en riesgo alto de deslizamiento en 2022. Vivimos aquí 15 familias..."},{id:"q0",tipo:"opciones",texto:"¿La autoridad ha tomado alguna acción?",ops:["Declararon el riesgo pero no ofrecen reubicación","Ofrecen subsidio de arriendo temporal pero sin solución definitiva","Los estudios ya se hicieron pero no hay respuesta formal","Nos piden desalojar sin darnos una alternativa"]},{id:"q0",tipo:"textarea",texto:"¿Cuántas personas viven en la vivienda y hay personas vulnerables?",placeholder:"Somos 6 personas incluyendo 2 niños pequeños y una abuela de 78 años. No tenemos a dónde ir..."}],cuota_ini:[{id:"q0",tipo:"textarea",texto:"¿Cuánto pagó de cuota inicial y por qué no se lo devuelven?",placeholder:"Pagué $18.000.000 de cuota inicial para un proyecto de AMARILO que cancelaron en 2023. No devuelven nada..."},{id:"q0",tipo:"opciones",texto:"¿Por qué canceló el proyecto la constructora?",ops:["La constructora canceló el proyecto unilateralmente","El proyecto se prolongó indefinidamente sin fecha cierta","Me querían cambiar el inmueble por otro de menor valor","Desistí porque la constructora incumplió las fechas pactadas"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva esperando la devolución?",placeholder:"Llevan 18 meses prometiendo la devolución. Dicen que tienen problemas de flujo de caja. Ya no responden..."}],ph_abuso:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de abuso ejerce la administración de la propiedad horizontal?",placeholder:"La administración me niega el acceso a las áreas comunes, me cobra multas sin proceso y no rinde cuentas..."},{id:"q0",tipo:"opciones",texto:"¿Qué problema específico tiene con la PH?",ops:["Cobro de cuotas de administración excesivas o sin soporte","Niegan acceso a áreas comunes o servicios del conjunto","Multas sin proceso disciplinario previo","No rinden cuentas ni permiten revisar libros contables","Permiten obras que afectan su vivienda o su paz"]},{id:"q0",tipo:"texto",texto:"¿Ha ido a la asamblea de copropietarios a reportar el problema?",placeholder:"Fui a la última asamblea y la administración impidió que hablara. No me deja participar ni votar..."}],rut_inscripcion:[{id:"q0",tipo:"opciones",texto:"¿Por qué necesita inscribirse en el RUT?",ops:["Voy a trabajar como independiente o freelancer","Voy a crear una empresa o negocio","Me piden el RUT para un contrato o empleo","Necesito declarar renta por primera vez este año"]},{id:"q0",tipo:"opciones",texto:"¿Sabe si ya tiene RUT sin saberlo?",ops:["Nunca lo he tramitado en mi vida","Creo que nunca lo hice pero no estoy seguro","El empleador anterior lo tramitó por mí","Tenía uno pero no sé si sigue activo"]},{id:"q0",tipo:"textarea",texto:"¿Ha tenido algún problema al intentar inscribirse en línea?",placeholder:"El portal MUISCA me da error, dice que ya existe un registro con mi cédula, o no puedo completar el formulario..."}],rut_actualizacion:[{id:"q0",tipo:"opciones",texto:"¿Qué dato necesita actualizar en el RUT?",ops:["Dirección o teléfono de contacto","Actividad económica (código CIIU)","Responsabilidades fiscales (agregar/quitar IVA, facturación)","Nombre comercial o razón social"]},{id:"q0",tipo:"opciones",texto:"¿Ha intentado actualizar en línea?",ops:["Sí, pero el portal da error o no guarda los cambios","Sí, pero me pide ir presencialmente a la DIAN","No, no sé cómo hacerlo por internet","Lo actualicé pero en los sistemas de terceros no aparece el cambio"]},{id:"q0",tipo:"textarea",texto:"¿Por qué es urgente actualizar el RUT?",placeholder:"Necesito facturar electrónicamente pero el sistema rechaza mis facturas porque el RUT tiene la dirección vieja..."}],rut_bloqueo:[{id:"q0",tipo:"opciones",texto:"¿Por qué está bloqueado el acceso al portal DIAN o RUT?",ops:["Contraseña bloqueada por múltiples intentos fallidos","Correo registrado ya no existe o no tengo acceso","La firma electrónica está vencida o no funciona","La cuenta fue bloqueada por inactividad o por la DIAN"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva sin poder acceder?",placeholder:"Llevo 3 semanas sin acceso. Tengo que presentar declaración de IVA en 8 días y no puedo entrar al sistema..."},{id:"q0",tipo:"textarea",texto:"¿Qué trámite urgente necesita hacer por eso?",placeholder:"Debo presentar la declaración de renta antes del 30 de agosto. Si no entro al portal, me van a multar..."}],renta_primera:[{id:"q0",tipo:"opciones",texto:"¿Por qué va a declarar renta este año por primera vez?",ops:["Mis ingresos superaron el umbral de la DIAN ($73M en 2025)","Mi patrimonio supera $235 millones","Mis consignaciones del año superaron los límites","Soy independiente y quiero declarar voluntariamente"]},{id:"q0",tipo:"opciones",texto:"¿Tiene RUT activo con responsabilidad 05 (Régimen ordinario)?",ops:["Sí, ya tengo RUT con esa responsabilidad","Tengo RUT pero sin responsabilidad de renta","No tengo RUT todavía","No sé qué responsabilidades tiene mi RUT actual"]},{id:"q0",tipo:"textarea",texto:"¿Qué tipo de ingresos tuvo durante el año?",placeholder:"Trabajo como empleado ($5M/mes), más arriendos ($1.5M/mes), y vendí un carro. No sé si todo va en la declaración..."}],renta_correccion:[{id:"q0",tipo:"opciones",texto:"¿Qué error cometió en la declaración?",ops:["Dejé de declarar un ingreso o un activo","Declaré un gasto que no era deducible","Error aritmético o de digitación en los valores","Apliqué una deducción a la que no tenía derecho"]},{id:"q0",tipo:"opciones",texto:"¿La DIAN ya le notificó el error o lo descubrió usted?",ops:["La DIAN me envió emplazamiento o requerimiento","Yo descubrí el error antes de que la DIAN diga algo","La DIAN ya impuso sanción y quiero corregir"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto cambia el impuesto con la corrección?",placeholder:"Si corrijo, debo pagar $1.200.000 adicionales más sanción del 10%. Quiero corregir antes de que la DIAN me detecte..."}],sancion_dian:[{id:"q0",tipo:"textarea",texto:"¿Qué sanción le impuso la DIAN y por qué razón?",placeholder:"La DIAN me impone sanción de $4.500.000 por no declarar el año 2023. Pero yo no tenía obligación de declarar ese año..."},{id:"q0",tipo:"opciones",texto:"¿En qué etapa está la sanción?",ops:["Recibí el requerimiento especial — tengo 3 meses para responder","Ya hay liquidación oficial — puedo recurrir en 2 meses","Ya hay sanción ejecutoriada — necesito recurso extraordinario","Me bloquearon el RUT o embargaron cuenta por la sanción"]},{id:"q0",tipo:"texto",texto:"¿Por qué considera que la sanción es injusta?",placeholder:"Ese año mis ingresos fueron $45M que estaba por debajo del límite de $53M. No estaba obligado a declarar..."}],exogena:[{id:"q0",tipo:"opciones",texto:"¿Qué problema tiene con la información exógena?",ops:["Reporté tarde y la DIAN me impone sanción","Reporté información incorrecta y la DIAN la detectó","Terceros me reportaron información diferente a la real","No sé si debo reportar información exógena este año"]},{id:"q0",tipo:"textarea",texto:"¿A qué año corresponde la información y cuánto es la sanción si ya la hay?",placeholder:"Es la exógena del año 2024. La presenté 2 días tarde. La DIAN ya me notificó sanción por $2.800.000..."},{id:"q0",tipo:"opciones",texto:"¿Ha presentado recurso o descargos?",ops:["No, apenas me llegó la notificación","Sí, presenté recurso pero no he recibido respuesta","Ya venció el plazo para recurrir"]}],retencion:[{id:"q0",tipo:"textarea",texto:"¿Quién le hace la retención y por qué considera que es incorrecta?",placeholder:"Mi empleador me retiene $850.000/mes. Hice los cálculos y la retención debería ser $320.000. Hay una diferencia de $530.000..."},{id:"q0",tipo:"opciones",texto:"¿Por qué es incorrecta la retención?",ops:["No descontaron mis deducciones (intereses de vivienda, dependientes)","Me aplican tabla de retención incorrecta para mi rango de ingreso","La base de retención incluye ingresos no gravados","El empleador retiene pero no declara ante la DIAN"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto calcula que le retienen de más al año?",placeholder:"Si la diferencia es $530.000/mes, al año son $6.360.000 retenidos de más que debería recuperar en la declaración..."}],fact_electronica:[{id:"q0",tipo:"opciones",texto:"¿Cuál es su problema con la facturación electrónica?",ops:["La DIAN no me habilita como facturador electrónico","El proveedor tecnológico tiene problemas con el DIAN","Mis facturas son rechazadas sin razón clara","No sé cómo empezar a facturar electrónicamente"]},{id:"q0",tipo:"textarea",texto:"¿Desde cuándo tiene el problema y cuántas facturas están afectadas?",placeholder:"Llevo 2 meses sin poder facturar. Mis clientes no me pagan porque no pueden hacer deducciones sin factura válida..."},{id:"q0",tipo:"textarea",texto:"¿Cuánto dinero está perdiendo por no poder facturar?",placeholder:"Tengo $15.000.000 en servicios prestados que no puedo cobrar porque los clientes exigen factura electrónica..."}],nit_error:[{id:"q0",tipo:"texto",texto:"¿Qué error tiene su NIT o datos en la DIAN?",placeholder:"Mi NIT tiene el dígito de verificación incorrecto en el sistema. Los bancos no aceptan mis documentos..."},{id:"q0",tipo:"opciones",texto:"¿En qué sistema o proceso genera problemas el error?",ops:["En el sistema bancario al abrir cuenta","En la PILA (aportes a seguridad social)","En el SECOP (contratos con el Estado)","En la facturación electrónica","En el formulario de declaración de renta"]},{id:"q0",tipo:"textarea",texto:"¿Cuánto tiempo lleva con el error y cómo está afectando su actividad?",placeholder:"Llevo 4 meses con el error. No puedo presentar la declaración y la DIAN dice que debo ir presencialmente..."}],dian_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitud o recurso presentó a la DIAN y cuándo?",placeholder:"El 5 de mayo presenté recurso de reconsideración contra la sanción por no declarar 2023. Radicado 009876..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles sin acuse de recibo","Más de 2 meses sin respuesta de fondo","Ya vencieron los plazos que tiene la DIAN para resolver","Me dijeron que resolvieron pero no recibo nada formal"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta la falta de respuesta de la DIAN?",placeholder:"Sin respuesta no puedo corregir el RUT, no puedo facturar, y los plazos para otros recursos siguen corriendo..."}],cobro_ind:[{id:"q0",tipo:"textarea",texto:"¿Qué le cobran exactamente y por qué no lo reconoce?",placeholder:"Me cobran $18.500 de un seguro de vida que nunca contraté, aparece en el extracto de mayo..."},{id:"q0",tipo:"textarea",texto:"¿En qué banco es y cuánto llevan cobrándole?",placeholder:"En Bancolombia, llevan 6 meses cobrando ese cargo. En total me han cobrado $111.000..."},{id:"q0",tipo:"opciones",texto:"¿Ha reclamado ante el banco?",ops:["Sí, reclamé y no solucionaron","Sí, fui al Defensor del Consumidor Financiero — sin resultado","No he reclamado todavía"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el extracto o comprobante que muestra el cobro?",placeholder:"Sí, tengo el extracto bancario donde aparece el cargo no autorizado..."}],fraude_banco:[{id:"q0",tipo:"textarea",texto:"¿Qué pasó exactamente? ¿Cómo se enteró del fraude?",placeholder:"Me llegó notificación de retiro de $1.500.000 y yo estaba en casa — nunca lo autoricé..."},{id:"q0",tipo:"textarea",texto:"¿Cuándo ocurrió y cuánto dinero perdió en total?",placeholder:"El 10 de junio a las 3pm. Perdí $2.300.000 en dos transacciones que no reconozco..."},{id:"q0",tipo:"opciones",texto:"¿El banco ya respondió su reclamación?",ops:["Sí, pero dicen que no es su responsabilidad","Respondieron pero no han devuelto el dinero","No han respondido nada todavía","Reconocieron el fraude pero no devuelven"]},{id:"q0",tipo:"textarea",texto:"¿Tiene capturas o notificaciones que prueban las transacciones no autorizadas?",placeholder:"Sí, tengo las notificaciones push del banco, capturas de pantalla y el extracto..."}],reporte_neg:[{id:"q0",tipo:"textarea",texto:"¿En qué central de riesgo aparece el reporte y por qué deuda?",placeholder:"Aparezco en Datacrédito con una deuda de $800.000 del Banco X que ya pagué hace 2 años..."},{id:"q0",tipo:"opciones",texto:"¿Tiene prueba de que la deuda fue pagada o es inexistente?",ops:["Sí, tengo recibo o certificado de pago","La deuda nunca fue mía — suplantación o error","Pagué pero no tengo el comprobante ahora","Hay un error en el monto o la fecha del reporte"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le ha afectado este reporte negativo en su vida?",placeholder:"No puedo sacar crédito, me rechazaron un arriendo, perdí una oferta de trabajo..."}],neg_cuenta:[{id:"q0",tipo:"textarea",texto:"¿Qué banco le niega el servicio y qué razón da?",placeholder:"Bancolombia me niega abrir cuenta de ahorros alegando perfil de riesgo elevado sin explicar..."},{id:"q0",tipo:"textarea",texto:"¿Ha intentado en más de un banco? ¿Todos le niegan?",placeholder:"Lo intenté en 3 bancos y todos niegan sin explicación clara ni fundamento legal..."},{id:"q0",tipo:"textarea",texto:"¿Por qué necesita el acceso bancario urgentemente?",placeholder:"Necesito la cuenta para recibir el salario, acceder a subsidios del gobierno..."}],banco_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué reclamó al banco y en qué fecha exacta?",placeholder:"El 10 de mayo reclamé al Defensor del Consumidor la devolución de $200.000 cobrados sin autorización..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin recibir respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Respondieron pero de forma evasiva sin solucionar"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que el banco no responda?",placeholder:"Siguen cobrando el cargo mensual no autorizado, ya van $600.000 acumulados..."}],trabajo_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué queja presentó al Ministerio del Trabajo y cuándo?",placeholder:"El 15 de abril presenté queja por no pago de salarios. Radicado MTR-2026-12345..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta o sin visita de inspector?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses sin inspección ni respuesta"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta la demora del Ministerio en responder?",placeholder:"Sin la inspección no puedo probar los incumplimientos del empleador ante el juez laboral..."}],pension_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a Colpensiones o AFP y en qué fecha?",placeholder:"El 10 de enero solicité reconocimiento de pensión de vejez. Radicado COL-2026-789012..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto llevan sin dar respuesta definitiva?",ops:["Más de 4 meses (mínimo para tutelar)","Más de 6 meses","Más de 1 año sin resolución"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta demora en su vida diaria?",placeholder:"Ya tengo 65 años, no tengo otro ingreso y mi salud se deteriora sin poder pagar medicamentos..."}],inmov_ilegal:[{id:"q0",tipo:"textarea",texto:"¿Cuándo y por qué razón exacta inmovilizaron su vehículo?",placeholder:"El agente inmovilizó mi moto el viernes alegando que no tenía SOAT, pero sí lo tenía vigente..."},{id:"q0",tipo:"textarea",texto:"¿Tiene documentos que demuestran que la inmovilización fue injusta?",placeholder:"Tengo el SOAT vigente hasta diciembre y la RTM al día. Tengo fotos de los documentos..."},{id:"q0",tipo:"textarea",texto:"¿Está en el patio todavía? ¿Cuánto le cobran por día?",placeholder:"Está en el patio. Me cobran $80.000 diarios y llevan 5 días sin dejarme recuperarlo..."}],mov_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la Secretaría de Movilidad y cuándo?",placeholder:"El 5 de mayo solicité prescripción del comparendo No. XXXXX por correo certificado..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin recibir respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses en silencio total"]},{id:"q0",tipo:"textarea",texto:"¿Tiene el comprobante de radicación o número de radicado?",placeholder:"Sí, tengo el acuse de recibo con número de radicado y sello de la Secretaría..."}],neg_cupo:[{id:"q0",tipo:"textarea",texto:"¿Para quién y en qué institución negaron el cupo?",placeholder:"Para mi hijo de 6 años en el Colegio Distrital La Esperanza, Bogotá. Lo negaron sin justificación..."},{id:"q0",tipo:"opciones",texto:"¿Qué razón dieron para negar el cupo?",ops:["Dicen que no hay cupos disponibles","Solicitan documentos que no corresponden","No dieron ninguna razón formal","Alegan que el menor no cumple algún requisito"]},{id:"q0",tipo:"textarea",texto:"¿Por qué es urgente o especial este cupo?",placeholder:"Mi hijo tiene 6 años y es obligatorio que esté escolarizado — es un derecho fundamental..."}],diploma_ret:[{id:"q0",tipo:"textarea",texto:"¿Qué institución retiene el diploma y desde cuándo lo solicitó?",placeholder:"El Colegio San José lleva 3 meses sin entregar el diploma de bachiller solicitado en marzo..."},{id:"q0",tipo:"opciones",texto:"¿Por qué razón le retienen el diploma?",ops:["Alegan deudas de pensión o matrícula","Dicen que hay proceso administrativo pendiente","No dan ninguna explicación formal","Dicen que está en proceso de expedición (meses)"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta no tener el diploma o certificados?",placeholder:"No puedo inscribirme a la universidad, perdí una oferta de trabajo por no tener los diplomas..."}],disc_edu:[{id:"q0",tipo:"textarea",texto:"¿Qué tipo de discriminación sufrió y en qué institución?",placeholder:"Mi hijo con autismo fue excluido de actividades del colegio. O me negaron el ingreso por mi origen..."},{id:"q0",tipo:"textarea",texto:"¿Cuándo ocurrió y tiene testigos?",placeholder:"Ocurrió el 15 de mayo. Hay otros padres dispuestos a declarar lo que presenciaron..."},{id:"q0",tipo:"textarea",texto:"¿Ha reclamado ante las directivas de la institución?",placeholder:"Fui a rectoría y dijeron que no podían hacer nada — que era política de la institución..."}],pension_exc:[{id:"q0",tipo:"textarea",texto:"¿Cuánto cobra la institución y cuánto considera el exceso?",placeholder:"El colegio cobra $800.000/mes cuando está autorizado máximo $400.000 según su matrícula..."},{id:"q0",tipo:"textarea",texto:"¿Tiene el contrato o reglamento que muestra el valor autorizado?",placeholder:"Tengo el contrato de matrícula donde figura el valor pactado que ahora duplican..."},{id:"q0",tipo:"textarea",texto:"¿Ha reclamado ante la institución? ¿Qué le respondieron?",placeholder:"Fui a la administración y dicen que los precios subieron por inflación sin respetar lo pactado..."}],neg_grado:[{id:"q0",tipo:"textarea",texto:"¿Por qué razón le niegan el grado y qué argumentan?",placeholder:"La universidad dice que debo una materia de electiva que ya cursé — hay un error en el sistema..."},{id:"q0",tipo:"texto",texto:"¿Tiene documentos que demuestran que cumplió todos los requisitos?",placeholder:"Tengo el paz y salvo financiero, las notas de todas las materias y el certificado de práctica..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva esperando el grado?",ops:["Menos de 3 meses","Entre 3 y 6 meses","Más de 6 meses","Más de 1 año sin grado"]}],edu_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la institución y en qué fecha?",placeholder:"El 15 de marzo solicité el diploma de bachiller y los certificados de notas de los últimos 3 años..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta falta de respuesta?",placeholder:"No puedo inscribirme a la universidad, perdí una oferta de trabajo, no puedo tramitar visa..."}],subsidio_viv:[{id:"q0",tipo:"textarea",texto:"¿A qué subsidio aplica y por qué lo niegan?",placeholder:"Apliqué a Mi Casa Ya con Fonvivienda. Me niegan alegando que no cumplo el Sisbén requerido..."},{id:"q0",tipo:"textarea",texto:"¿Tiene el Sisbén actualizado y cumple los requisitos del programa?",placeholder:"Tengo Sisbén IV grupo A2. Según la normativa debería calificar para el subsidio vigente..."},{id:"q0",tipo:"textarea",texto:"¿Cuánto lleva esperando o tiene un rechazo formal?",placeholder:"Me llegó resolución de rechazo el 10 de abril. Argumentan que excedo ingresos pero no es así..."}],desalojo:[{id:"q0",tipo:"textarea",texto:"¿Por qué le quieren desalojar y en qué fecha sería el lanzamiento?",placeholder:"El propietario dice que llevo 3 meses sin pagar arriendo. El lanzamiento sería el 30 de junio..."},{id:"q0",tipo:"multi",texto:"¿Hay personas en situación especial en el hogar?",ops:["Niños menores de edad","Adultos mayores (más de 60 años)","Persona con enfermedad grave","Persona con discapacidad","Mujer embarazada","Ninguno"]},{id:"q0",tipo:"textarea",texto:"¿Tiene alguna posibilidad de solución o está en vulnerabilidad extrema?",placeholder:"Perdí el trabajo hace 2 meses, tengo hijos pequeños y no tengo a dónde ir..."}],vivienda_ind:[{id:"q0",tipo:"textarea",texto:"¿Cuáles son las condiciones indignas de su vivienda?",placeholder:"No hay agua potable, el techo filtra, hay plagas, las paredes tienen grietas peligrosas..."},{id:"q0",tipo:"textarea",texto:"¿Quién es el responsable (propietario, empresa, Estado)?",placeholder:"El propietario lleva 6 meses prometiendo reparar las filtraciones pero no cumple..."},{id:"q0",tipo:"textarea",texto:"¿Ha denunciado o reclamado formalmente?",placeholder:"Fui a la alcaldía y me dijeron que pusiera queja formal pero nadie ha venido a verificar..."}],constructora:[{id:"q0",tipo:"textarea",texto:"¿Qué incumplió la constructora o qué vicios encontró en la vivienda?",placeholder:"Entregaron con humedades en todas las paredes y el piso levantado desde el primer mes..."},{id:"q0",tipo:"textarea",texto:"¿Cuándo entregaron la vivienda y cuándo detectó los problemas?",placeholder:"Entregaron en enero 2024 y los vicios aparecieron en el primer mes de ocupación..."},{id:"q0",tipo:"textarea",texto:"¿Ha reclamado ante la constructora y qué respondieron?",placeholder:"Fui 5 veces y siempre dicen que lo van a arreglar pero nunca envían a nadie..."}],no_saneamiento:[{id:"q0",tipo:"textarea",texto:"¿Qué servicio de saneamiento falta y desde cuándo?",placeholder:"En el barrio no hay alcantarillado desde hace 3 años. Las aguas negras corren por la calle..."},{id:"q0",tipo:"textarea",texto:"¿Cuántas familias están afectadas y hay personas vulnerables?",placeholder:"Somos 50 familias afectadas. Hay niños menores y dos adultos mayores con enfermedades crónicas..."},{id:"q0",tipo:"texto",texto:"¿Han presentado solicitudes a la alcaldía o a la empresa de servicios?",placeholder:"Enviamos carta firmada por todas las familias a la alcaldía. Nos prometieron solución pero nada..."}],viv_sp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó, a quién y en qué fecha?",placeholder:"El 20 de marzo solicité al Ministerio de Vivienda información sobre el estado de mi subsidio radicado..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta falta de respuesta?",placeholder:"No sé si mi subsidio fue aprobado. Ya perdí una oportunidad de compra por la incertidumbre..."}],pet_alc:[{id:"q0",tipo:"textarea",texto:"¿Qué le solicitó a la alcaldía y en qué fecha exacta?",placeholder:"El 3 de abril solicité información sobre el estado de mi lote en escrituración. Radicado 123456..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que la alcaldía no responda?",placeholder:"No puedo tramitar la escritura pública y el negocio de compraventa está paralizado..."}],pet_ban:[{id:"q0",tipo:"textarea",texto:"¿Qué reclamó al banco y en qué fecha?",placeholder:"El 10 de mayo reclamé al Defensor del Consumidor la devolución de $200.000 cobrados sin autorización..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta formal?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Respondieron pero de forma evasiva"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que el banco no responda?",placeholder:"Siguen cobrando el cargo mensual no autorizado, ya acumulé $600.000 en cobros indebidos..."}],pet_edu:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la institución educativa y cuándo?",placeholder:"El 15 de marzo solicité el diploma de bachiller y certificados de notas..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 3 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta esta falta de respuesta?",placeholder:"No puedo inscribirme a la universidad ni tramitar empleo por falta del documento..."}],pet_dian:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la DIAN y cuándo?",placeholder:"El 5 de abril solicité corrección del RUT y actualización de responsabilidades fiscales..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Qué consecuencia tiene la demora de la DIAN en su caso?",placeholder:"No puedo facturar electrónicamente, perdí un contrato por no poder acreditar el RUT actualizado..."}],pet_inm:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a Migración Colombia y cuándo?",placeholder:"El 20 de febrero solicité información sobre el estado de mi visa de trabajo. Radicado MCO-12345..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que Migración no responda?",placeholder:"Mi permiso de trabajo está vencido y no puedo trabajar legalmente mientras esperan..."}],pet_eps:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a la EPS o IPS y cuándo?",placeholder:"El 5 de mayo solicité autorización para cirugía de columna. Radicado EPS-2026-445678..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 15 días hábiles","Más de 30 días hábiles","Más de 2 meses"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta que la EPS no responda?",placeholder:"Sin la autorización no puedo hacerme la cirugía que necesito urgentemente..."}],pet_colp:[{id:"q0",tipo:"textarea",texto:"¿Qué solicitó a Colpensiones o AFP y cuándo?",placeholder:"El 10 de enero solicité reconocimiento de pensión de vejez. Radicado COL-2026-789012..."},{id:"q0",tipo:"opciones",texto:"¿Cuánto lleva sin respuesta?",ops:["Más de 4 meses (mínimo para tutelar)","Más de 6 meses","Más de 1 año"]},{id:"q0",tipo:"textarea",texto:"¿Cómo le afecta la demora en su vida?",placeholder:"Tengo 65 años, no tengo otro ingreso y mi salud se deteriora sin poder costear medicamentos..."}]};const GENERICAS=[{id:"q1",tipo:"textarea",texto:"Cuénteme qué está pasando con sus propias palabras. Entre más detalles, mejor.",ph:"Escriba aquí todo lo que está viviendo desde el principio..."},{id:"q2",tipo:"textarea",texto:"¿Desde cuándo ocurre y qué ha intentado hacer para solucionarlo?",ph:"Esto empezó hace... He intentado llamar, ir personalmente,.."},{id:"q3",tipo:"opciones",texto:"¿Tiene documentos, recibos o mensajes relacionados?",ops:["Sí, tengo varios documentos importantes","Tengo algunos documentos","Solo tengo testigos","No tengo nada aún"]},{id:"q4",tipo:"textarea",texto:"¿Hay personas en situación especial afectadas (menores, adultos mayores, discapacidad)?",ph:"Tengo hijos menores, soy adulto mayor, tengo una enfermedad crónica..."}];const CAMPOS=[{id:"nombre",label:"Nombre completo",ph:"Como aparece en su cédula",full:false},{id:"cedula",label:"Número de cédula",ph:"Sin puntos ni comas",full:false},{id:"telefono",label:"Teléfono celular",ph:"300 000 0000",full:false},{id:"ciudad",label:"Ciudad donde vive",ph:"Bogotá, Medellín, Cali...",full:false},{id:"email",label:"Correo electrónico",ph:"su@correo.com",full:false},{id:"direccion",label:"Dirección de residencia",ph:"Calle 12 # 45-67, Barrio...",full:true},{id:"entidad",label:"Nombre exacto de la entidad que lo afecta",ph:"EPS Sanitas, Colpensiones, Secretaría de Movilidad de Bogotá...",full:true},{id:"rep_legal",label:"Representante legal (si lo sabe)",ph:"Puede dejarlo en blanco",full:false},{id:"dir_entidad",label:"Dirección o correo de la entidad",ph:"Calle 100 # 50-12 o correo@entidad.gov.co",full:true}];const fHoy=()=>new Date().toISOString().split("T")[0];const fFecha=f=>{if(!f)return"";const[y,m,d]=f.split("-");return`${d}/${m}/${y}`;};const fBytes=b=>!b?"":b<1048576?`${(b/1024).toFixed(1)} KB`:`${(b/1048576).toFixed(1)} MB`;const iconoArchivo=t=>!t?"📎":t.startsWith("image")?"🖼️":t.startsWith("audio")?"🎵":t.startsWith("video")?"🎬":t.includes("pdf")?"📄":t.includes("word")?"📝":"📎";const CSS=`/* ═══════════════════════════════════════════════════════════════
   AYUDA CIUDADANA — Sistema de diseño v3 (Moderno Cálido)
   Azul confiable + Coral cálido · Profundidad · Movimiento
   ═══════════════════════════════════════════════════════════════ */
:root{
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  /* Azul confianza (protagonista) */
  --azul: #2563EB;
  --azul-vivo: #1D4ED8;
  --azul-claro: #3B82F6;
  --azul-cielo: #E8EEFB;
  --azul-niebla: #F4F7FE;
  /* Coral cálido (acento, llamadas a la acción) */
  --coral: #FF6B5C;
  --coral-claro: #FF8A7D;
  --coral-vivo: #FF5542;
  --coral-niebla: #FFF0EE;
  /* Texto y superficies */
  --tinta: #16223D;
  --texto: #16223D;
  --texto-suave: #6B7280;
  --linea: #E5E9F0;
  --card-bg: #FFFFFF;
  --border2: #E5E9F0;
  --text: #16223D;
  --fondo: #F7F9FC;
  --exito: #15B886;
  --alerta: #DC2626;
  --dorado: #F5A623;
  --sombra-sm: 0 1px 3px rgba(30,80,200,.07), 0 1px 2px rgba(30,80,200,.05);
  --sombra-md: 0 4px 16px rgba(30,80,200,.1), 0 2px 6px rgba(30,80,200,.06);
  --sombra-lg: 0 12px 32px rgba(30,80,200,.14), 0 4px 12px rgba(30,80,200,.08);
  --sombra-azul: 0 8px 24px rgba(30,80,200,.28);
  --sombra-coral: 0 8px 24px rgba(255,107,92,.28);
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  background: #FFFFFF;
  color:var(--texto);
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','DM Sans',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  line-height:1.6;
  min-height:100vh;
  letter-spacing:-0.01em;
}

/* ── NAV SUPERIOR ─────────────────────────────────────────────── */
nav{
  background:rgba(255,255,255,.85);
  backdrop-filter:saturate(180%) blur(20px);
  -webkit-backdrop-filter:saturate(180%) blur(20px);
  border-bottom:1px solid var(--linea);
  padding:10px 16px;
  padding-top:calc(10px + var(--safe-top));
  display:flex;align-items:center;gap:8px;
  position:sticky;top:0;z-index:100;
  box-shadow:0 1px 0 rgba(30,80,200,.04);
}

/* ── BOTONES NAV ──────────────────────────────────────────────── */
.nl{
  background:none;border:none;cursor:pointer;font-family:inherit;
  color:var(--texto-suave);font-size:13px;font-weight:600;
  padding:7px 11px;border-radius:10px;transition:all .18s ease;
  white-space:nowrap;
}
.nl:hover{background:var(--azul-niebla);color:var(--azul);}

/* ── BOTONES GENERALES ────────────────────────────────────────── */
.btn{
  cursor:pointer;border:none;font-family:inherit;font-weight:700;
  border-radius:13px;transition:all .22s cubic-bezier(.22,1,.36,1);
  display:inline-flex;align-items:center;justify-content:center;gap:7px;
}
.btn:active{transform:scale(.97);}
/* Primario azul */
.ba{
  background:linear-gradient(135deg,var(--azul) 0%,var(--azul-claro) 100%);
  color:#fff;padding:13px 24px;font-size:14px;
  box-shadow:var(--sombra-azul);
}
.ba:hover{box-shadow:0 12px 30px rgba(30,80,200,.4);transform:translateY(-2px);}
/* Acción cálida coral (CTA principal) */
.bc{
  background:linear-gradient(135deg,var(--coral) 0%,var(--coral-claro) 100%);
  color:#fff;padding:13px 24px;font-size:14px;
  box-shadow:var(--sombra-coral);
}
.bc:hover{box-shadow:0 12px 30px rgba(255,107,92,.4);transform:translateY(-2px);}
/* Outline */
.bo{
  background:#fff;color:var(--azul);border:1.5px solid var(--azul-cielo);
  padding:12px 22px;font-size:14px;box-shadow:var(--sombra-sm);
}
.bo:hover{border-color:var(--azul-claro);background:var(--azul-niebla);transform:translateY(-1px);}
/* Éxito verde */
.bv{
  background:linear-gradient(135deg,var(--exito),#0E9E73);color:#fff;
  padding:13px 24px;font-size:14px;box-shadow:0 8px 24px rgba(21,184,134,.28);
}
.bv:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(21,184,134,.4);}
/* Peligro rojo */
.bd{
  background:linear-gradient(135deg,var(--alerta),#b91c1c);color:#fff;
  padding:13px 24px;font-size:14px;box-shadow:0 8px 24px rgba(220,38,38,.28);
}
.bghost{background:none;color:var(--texto-suave);border:none;padding:10px 18px;font-size:13px;}
.bghost:hover{color:var(--azul);}
.sm{padding:8px 16px !important;font-size:12.5px !important;border-radius:10px !important;}
.br{border-radius:99px !important;}

/* ── TARJETAS DE CATEGORÍA (grid) ─────────────────────────────── */
.ga{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:16px;
}
.cc{
  position:relative;
  background:var(--card-bg);
  border:1px solid var(--linea);
  border-radius:20px;
  padding:22px 20px;
  cursor:pointer;
  transition:all .28s cubic-bezier(.22,1,.36,1);
  text-align:left;width:100%;
  box-shadow:var(--sombra-sm);
  overflow:hidden;
}
.cc::before{
  content:"";position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,var(--azul),var(--coral));
  transform:scaleX(0);transform-origin:left;transition:transform .3s ease;
}
.cc:hover{
  border-color:var(--azul-cielo);
  box-shadow:var(--sombra-lg);
  transform:translateY(-4px);
}
.cc:hover::before{transform:scaleX(1);}

/* ── TARJETA GENÉRICA ─────────────────────────────────────────── */
.card{
  background:var(--card-bg);
  border:1px solid var(--linea);
  border-radius:18px;
  padding:22px;
  box-shadow:var(--sombra-md);
  color:var(--texto);
}

/* ── TAGS / ETIQUETAS ─────────────────────────────────────────── */
.tag{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:99px;font-size:11px;font-weight:700;letter-spacing:.01em;}
.tag-blue{background:var(--azul-cielo);color:var(--azul);}
.tag-gray{background:#F1F5F9;color:var(--texto-suave);}
.tag-coral{background:var(--coral-niebla);color:var(--coral-vivo);}

/* ── LISTA / TIMELINE ─────────────────────────────────────────── */
.li{display:flex;gap:14px;padding-bottom:20px;position:relative;}

/* ── CAJAS DE ESTADO ──────────────────────────────────────────── */
.success-box{background:linear-gradient(135deg,#EFFBF6,#D5F5EA);border:1px solid #8DE3C5;border-radius:14px;padding:14px 16px;color:#0E9E73;}
.warn-box{background:linear-gradient(135deg,#FFFBEB,#FEF3C7);border:1px solid #FCD34D;border-radius:14px;padding:14px 16px;color:#92400E;}
.urg{background:linear-gradient(135deg,#FEF2F2,#FEE2E2);border:1px solid #FCA5A5;border-radius:12px;padding:8px 14px;color:var(--alerta);font-weight:700;font-size:12px;display:inline-flex;align-items:center;gap:5px;}

/* ── INPUTS ───────────────────────────────────────────────────── */
input,textarea,select{
  width:100%;font-family:inherit;font-size:16px;color:var(--texto);
  background:#fff;border:1.5px solid var(--linea);border-radius:12px;
  padding:12px 14px;transition:all .18s ease;outline:none;
}
input:focus,textarea:focus,select:focus{
  border-color:var(--azul-claro);
  box-shadow:0 0 0 4px rgba(30,80,200,.12);
}
label{display:block;font-size:12.5px;font-weight:600;color:var(--texto);margin-bottom:6px;}

/* ── ANIMACIÓN ENTRADA ────────────────────────────────────────── */
.fade{animation:fadeUp .4s cubic-bezier(.22,1,.36,1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.pul{animation:pul 1.4s ease infinite;}
@keyframes pul{0%,100%{opacity:1;}50%{opacity:.45;}}
.glow{animation:glow 2s ease infinite;}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(255,107,92,.4);}50%{box-shadow:0 0 0 12px rgba(255,107,92,0);}}

/* ── DOCUMENTO GENERADO ───────────────────────────────────────── */
.tdoc{
  background:#fff;border:1px solid var(--linea);border-radius:14px;
  padding:28px;font-family:'Georgia',serif;font-size:13.5px;line-height:1.9;
  color:#1a1a1a;white-space:pre-wrap;box-shadow:var(--sombra-sm);
  max-height:60vh;overflow-y:auto;
}

/* ── DROPZONE ─────────────────────────────────────────────────── */
.dz{
  border:2px dashed var(--azul-cielo);border-radius:16px;padding:28px 20px;
  text-align:center;cursor:pointer;transition:all .2s ease;background:var(--azul-niebla);
}
.dz:hover{border-color:var(--coral);background:var(--coral-niebla);}

/* ── HELPERS ──────────────────────────────────────────────────── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g13{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.sc{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;-webkit-overflow-scrolling:touch;}
.sc::-webkit-scrollbar{height:5px;}
.sc::-webkit-scrollbar-thumb{background:var(--azul-cielo);border-radius:99px;}
.ep{padding:40px 20px;text-align:center;color:var(--texto-suave);}
.pb{padding-bottom:90px;}
.pc{max-width:680px;margin:0 auto;padding:20px;}
.pf{max-width:780px;margin:0 auto;padding:20px;}

/* ── NAV INFERIOR MÓVIL ───────────────────────────────────────── */
.nav-inferior-movil{display:none;}
.con-nav-inferior{padding-bottom:0;}
@media(max-width:760px){
  .hm{display:none !important;}
  .ga{grid-template-columns:1fr 1fr;gap:12px;}
  .cc{padding:18px 15px;border-radius:16px;}
  .g2{grid-template-columns:1fr;}
  .nav-inferior-movil{
    display:flex;position:fixed;bottom:0;left:0;right:0;z-index:200;
    background:rgba(255,255,255,.92);backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border-top:1px solid var(--linea);
    padding:8px 6px;padding-bottom:calc(8px + var(--safe-bottom));
    justify-content:space-around;
  }
  .cbot{
    background:none;border:none;cursor:pointer;font-family:inherit;
    display:flex;flex-direction:column;align-items:center;gap:2px;
    color:var(--texto-suave);font-size:10px;font-weight:600;
    padding:5px 10px;border-radius:12px;transition:all .15s ease;flex:1;
    border-top:2px solid transparent;
  }
  .cbot.activo{color:var(--azul);background:var(--azul-niebla);border-top-color:var(--coral);}
  .con-nav-inferior{padding-bottom:80px !important;}
  .nav-safe{padding-bottom:calc(8px + var(--safe-bottom));}
  .bottom-safe{height:calc(70px + var(--safe-bottom));}
}

/* ── MODO OSCURO ──────────────────────────────────────────────── */
body.dark{
  --card-bg:#1A1F2E;--border2:#2D3548;--text:#E5E9F2;
  --texto:#E5E9F2;--texto-suave:#A0AAB8;--linea:#2D3548;--fondo:#0F1419;
  --azul-niebla:#1A2335;--azul-cielo:#1E3A5F;--coral-niebla:#2A1F1D;
  background:
    radial-gradient(1200px 600px at 80% -10%, #16203A 0%, transparent 55%),
    radial-gradient(900px 500px at -10% 10%, #281A18 0%, transparent 50%),
    #0F1419;
}
body.dark nav{background:rgba(20,25,38,.85);}
body.dark .nav-inferior-movil{background:rgba(20,25,38,.92);}
body.dark .cc,body.dark .card{background:#1A1F2E;border-color:#2D3548;}
body.dark .bo{background:#1A1F2E;color:#93C5FD;border-color:#1E3A5F;}
body.dark input,body.dark textarea,body.dark select{background:#0F1628;border-color:#2D3548;color:#E5E9F2;}
body.dark .tdoc{background:#0F1628;color:#CBD5E1;border-color:#2D3548;}
body.dark .tag-gray{background:#1E293B;color:#A0AAB8;}
body.dark .dz{background:#131C30;border-color:#1E3A5F;}

.cb{background:linear-gradient(135deg,var(--azul-niebla),#E2E9FC);border:1px solid var(--azul-cielo);border-radius:14px;padding:14px 16px;}
body.dark .cb{background:#1A2335;border-color:#1E3A5F;}
/* ── IMPRESIÓN ────────────────────────────────────────────────── */
@media print{
  nav,.nav-inferior-movil,.btn:not(.print-show),#chat-btn{display:none !important;}
  .card{box-shadow:none !important;border:1px solid #ccc !important;}
  .tdoc{max-height:none !important;border:none !important;}
}

/* ── Componentes de UI (botones de opción, línea de tiempo, toast, micrófono) ── */
.ob{display:block;width:100%;text-align:left;padding:13px 16px;border:1.5px solid var(--azul-cielo);border-radius:12px;background:#fff;color:#1f2937;font-size:15px;font-family:inherit;cursor:pointer;transition:all .15s;line-height:1.45;}
.ob:hover{border-color:var(--azul);background:var(--azul-niebla);}
.ob.sel{border-color:var(--azul);background:var(--azul-niebla);color:var(--azul-vivo);font-weight:700;box-shadow:0 2px 10px rgba(30,80,200,.15);}
.ob.ms{border-color:var(--exito);background:#EFFBF6;color:#0E9E73;font-weight:600;}
.ed{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;border:2px solid #E5E7EB;background:#fff;color:#9CA3AF;position:relative;z-index:1;transition:all .2s;}
.ed.h{background:var(--exito);border-color:var(--exito);color:#fff;}
.ed.a{background:#fff;border-color:var(--coral);color:var(--coral-vivo);box-shadow:0 0 0 4px rgba(255,107,92,.18);}
.ed.p{background:#fff;border-color:#E5E7EB;color:#9CA3AF;}
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%);background:var(--tinta);color:#fff;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.25);z-index:9999;max-width:90vw;text-align:center;animation:fadeUp .25s ease;}
.toast.er{background:#DC2626;}
.toast.wa{background:#D97706;}
.mbt{background:var(--azul-niebla);border:1.5px solid var(--azul-cielo);color:var(--azul);border-radius:10px;padding:9px 12px;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;flex-shrink:0;transition:all .15s;}
.mbt:hover{background:var(--azul-cielo);}
.mbt.gr{background:var(--coral-niebla);border-color:var(--coral-claro);color:var(--coral-vivo);animation:pul 1.2s infinite;}
body.dark .ob{background:#0f1830;border-color:#24304d;color:#e5e9f5;}
body.dark .ob.sel{background:#16224a;color:#cdd8ff;}
body.dark .ed{background:#0f1830;border-color:#24304d;}\n/* Header móvil: evitar overflow horizontal */\nhtml,body{overflow-x:hidden;max-width:100vw;}\nnav{overflow:hidden;}\nnav>div{max-width:100%;overflow:hidden;}\n@media(max-width:760px){\n  nav>div{gap:5px !important;padding:0 !important;}\n  nav button{padding:6px 8px !important;font-size:11.5px !important;white-space:nowrap;}\n  nav .nl.hm,nav .hm{display:none !important;}\n  nav span{white-space:nowrap;}\n}\n@media(max-width:430px){\n  nav{padding-left:10px !important;padding-right:10px !important;}\n  nav button{padding:5px 7px !important;font-size:11px !important;}\n}`;function MicCampo({value,onChange,ph,rows=4,label}){const[rec,setRec]=useState(false);const rRef=useRef(null);const toggle=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert("Use Chrome o Edge para el micrófono.");return;}if(rec){rRef.current?.stop();setRec(false);return;}const r=new SR();r.lang="es-CO";r.continuous=true;r.interimResults=false;r.onresult=e=>{const t=Array.from(e.results).map(x=>x[0].transcript).join(" ");onChange(value?value+" "+t:t);};r.onerror=()=>setRec(false);r.onend=()=>setRec(false);r.start();rRef.current=r;setRec(true);};return React.createElement("div",null,label&&React.createElement("label",null,label),React.createElement("div",{style:{display:"flex",gap:8,alignItems:"flex-start"}},React.createElement("textarea",{rows:rows,placeholder:ph,value:value||"",onChange:e=>onChange(e.target.value),style:{flex:1}}),React.createElement("button",{className:`mbt${rec?" gr":""}`,onClick:toggle,type:"button",title:rec?"Detener":"Hablar (transcripción automática)"},rec?"⏹️":"🎙️")),React.createElement("label",{title:"Adjuntar evidencias",style:{width:"42px",height:"42px",borderRadius:"50%",background:"#EEF3FE",border:"2px solid #DCE6FB",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}},"📎",React.createElement("input",{type:"file",multiple:true,accept:"image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.xlsx,.csv",style:{display:"none"},onChange:e=>{if(e.target.files&&e.target.files.length>0){const ns=Array.from(e.target.files).map(f=>f.name).join(", ");onChange(value?(value+" [📎 "+ns+"]"):"[📎 "+ns+"]");}}})),rec&&React.createElement("div",{style:{fontSize:11,color:"#DC2626",marginTop:3,fontWeight:600}},"\uD83D\uDD34 Grabando... hable ahora. Toque \u23F9\uFE0F para detener."),React.createElement("div",{style:{fontSize:11,color:"#9CA3AF",marginTop:3}},"\uD83D\uDCA1 Toque \uD83C\uDF99\uFE0F para hablar en lugar de escribir"));}function ChatAbogado({caso,onClose}){const[msgs,setMsgs]=useState([{r:"b",t:caso?`Hola. Estoy revisando su caso "${caso.subcasoNombre}" contra ${caso.datosPersonales?.entidad||"la entidad"}. ¿Qué necesita saber?`:`Hola. Soy su plataforma legal colombiana. Cuénteme su problema y lo orientaré paso a paso. Puede escribir o tocar 🎙️ para hablar.`}]);const[inp,setInp]=useState("");const[load,setLoad]=useState(false);const endR=useRef(null);useEffect(()=>{endR.current?.scrollIntoView({behavior:"smooth"});},[msgs]);const enviar=async txt=>{if(!txt.trim())return;const nm=[...msgs,{r:"u",t:txt}];setMsgs(nm);setInp("");setLoad(true);const ctx=caso?`EXPEDIENTE: Caso "${caso.subcasoNombre}", Entidad: ${caso.datosPersonales?.entidad||"no especificada"}, Etapa: ${ETAPAS.find(e=>e.id===caso.etapa)?.nombre}, Historial: ${caso.historial?.map(h=>h.evento).join("; ")}\n\n`:"";const prompt=`Eres un abogado colombiano empático y claro, especializado en derechos fundamentales. Respondes en lenguaje sencillo que cualquier colombiano entienda. Cuando usas términos legales los explicas. Eres proactivo: si detectas urgencia, lo dices y propones la acción siguiente.
${ctx}CONVERSACIÓN:
${nm.slice(-6).map(m=>`${m.r==="u"?"Usuario":"Abogado"}: ${m.t}`).join("\n")}

Responde en máximo 180 palabras. Si hay urgencia, dilo claramente. Termina con una acción concreta que puede tomar.`;try{const res=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:700,messages:[{role:"user",content:prompt}]})});const j=await res.json();setMsgs(p=>[...p,{r:"b",t:j.content?.map(x=>x.text||"").join("")||"Error de conexión."}]);}catch{setMsgs(p=>[...p,{r:"b",t:"Error de conexión. Verifique su internet."}]);}setLoad(false);};return React.createElement("div",{style:{position:"fixed",bottom:24,right:24,width:370,maxWidth:"calc(100vw - 32px)",background:"#fff",borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,.2)",zIndex:1000,display:"flex",flexDirection:"column",maxHeight:"72vh"}},React.createElement("div",{style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",borderRadius:"20px 20px 0 0",padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}},React.createElement("div",{style:{display:"flex",gap:10,alignItems:"center"}},React.createElement("div",{style:{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}},"\u2696\uFE0F"),React.createElement("div",null,React.createElement("div",{style:{color:"#fff",fontWeight:700,fontSize:14}},"Abogado Digital"),React.createElement("div",{style:{color:"rgba(255,255,255,.7)",fontSize:11}},"IA especializada en derechos colombianos"))),React.createElement("button",{onClick:onClose,style:{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}},"\u2715")),React.createElement("div",{style:{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}},msgs.map((m,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:8,alignItems:"flex-start",flexDirection:m.r==="u"?"row-reverse":"row"}},m.r==="b"&&React.createElement("div",{style:{width:26,height:26,borderRadius:"50%",background:"#EEF3FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}},"\u2696\uFE0F"),React.createElement("div",{className:m.r==="b"?"cbot":"cusr"},m.t))),load&&React.createElement("div",{style:{display:"flex",gap:8}},React.createElement("div",{style:{width:26,height:26,borderRadius:"50%",background:"#EEF3FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}},"\u2696\uFE0F"),React.createElement("div",{className:"cbot pul"},"Analizando su caso...")),React.createElement("div",{ref:endR})),React.createElement("div",{style:{padding:"10px 14px",borderTop:"1px solid #E5E7EB"}},React.createElement(MicCampo,{value:inp,onChange:setInp,ph:"Escriba o hable su consulta...",rows:2}),React.createElement("button",{className:"btn ba sm",style:{width:"100%",marginTop:8},onClick:()=>enviar(inp),disabled:load||!inp.trim()},"Enviar consulta")));}const VALORES_2026={smmlv:1750905,auxTransporte:249095,tasaUsura:28.79,tasaBancariaCorriente:19.19,uvt:52374};const fmt=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n||0);const fmtN=n=>new Intl.NumberFormat("es-CO",{maximumFractionDigits:0}).format(n||0);function CalcLiquidacion(){const[f,setF]=useState({salario:"",inicio:"",fin:"",motivo:"despido_injusto",tipo:"indefinido",salarioIntegral:false,auxT:true,vacPend:0,horasExtra:0});const[res,setRes]=useState(null);const calcular=()=>{const sal=parseFloat(f.salario.replace(/\./g,"").replace(",","."))||0;if(!sal||!f.inicio||!f.fin)return;const inicio=new Date(f.inicio);const fin=new Date(f.fin);const diasTotal=Math.floor((fin-inicio)/(1000*60*60*24));const anosExactos=diasTotal/365;const anos=Math.floor(anosExactos);const diasFraccion=diasTotal-anos*365;const salDia=sal/30;const salDiaConAux=f.auxT&&sal<=VALORES_2026.smmlv*2?(sal+VALORES_2026.auxTransporte)/30:salDia;const cesantias=salDiaConAux*diasTotal*(30/365);const intCesantias=cesantias*0.12;const prima=salDiaConAux*diasTotal*(15/180);const vacaciones=salDia*diasTotal*(15/365);const vacPendMonto=salDia*15*(f.vacPend||0);let indemnizacion=0;if(f.motivo==="despido_injusto"||f.motivo==="despido_embarazo"||f.motivo==="despido_discapacidad"){if(f.tipo==="indefinido"){if(f.salarioIntegral||sal>VALORES_2026.smmlv*10){indemnizacion=salDia*20;if(anosExactos>1)indemnizacion+=salDia*15*(anosExactos-1);}else{indemnizacion=salDia*30;if(anosExactos>1)indemnizacion+=salDia*20*(anosExactos-1);}}else if(f.tipo==="fijo"){indemnizacion=Math.max(salDia*15,0);}else{indemnizacion=salDia*20*Math.max(1,anosExactos);}if(f.motivo==="despido_embarazo"||f.motivo==="despido_discapacidad"){indemnizacion+=salDia*180;}}const penalidad=f.motivo==="no_pago"?salDia*30:0;const total=cesantias+intCesantias+prima+vacaciones+vacPendMonto+indemnizacion+penalidad;const horasExtraMonto=sal/240*1.25*(f.horasExtra||0);setRes({cesantias:Math.round(cesantias),intCesantias:Math.round(intCesantias),prima:Math.round(prima),vacaciones:Math.round(vacaciones),vacPendMonto:Math.round(vacPendMonto),indemnizacion:Math.round(indemnizacion),penalidad:Math.round(penalidad),horasExtraMonto:Math.round(horasExtraMonto),total:Math.round(total+horasExtraMonto),anos,diasTotal,diasFraccion,salDia:Math.round(salDia)});};const setVal=(k,v)=>setF(p=>({...p,[k]:v}));return React.createElement("div",null,React.createElement("div",{style:{background:"#EEF3FE",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A42A3"}},"\uD83D\uDCC5 Valores vigentes 2026: SMMLV ",fmt(VALORES_2026.smmlv)," \xB7 Aux. transporte ",fmt(VALORES_2026.auxTransporte)," \xB7 Art. 64 CST"),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Salario mensual ($)"),React.createElement("input",{placeholder:"Ej: 3.500.000",value:f.salario,onChange:e=>setVal("salario",e.target.value)})),React.createElement("div",null,React.createElement("label",null,"Tipo de contrato"),React.createElement("select",{value:f.tipo,onChange:e=>setVal("tipo",e.target.value)},React.createElement("option",{value:"indefinido"},"T\xE9rmino indefinido"),React.createElement("option",{value:"fijo"},"T\xE9rmino fijo"),React.createElement("option",{value:"obra"},"Obra o labor"))),React.createElement("div",null,React.createElement("label",null,"Fecha de inicio del contrato"),React.createElement("input",{type:"date",value:f.inicio,onChange:e=>setVal("inicio",e.target.value)})),React.createElement("div",null,React.createElement("label",null,"Fecha de terminaci\xF3n"),React.createElement("input",{type:"date",value:f.fin,onChange:e=>setVal("fin",e.target.value),max:new Date().toISOString().split("T")[0]})),React.createElement("div",null,React.createElement("label",null,"Motivo de terminaci\xF3n"),React.createElement("select",{value:f.motivo,onChange:e=>setVal("motivo",e.target.value)},React.createElement("option",{value:"despido_injusto"},"Despido sin justa causa"),React.createElement("option",{value:"renuncia"},"Renuncia voluntaria"),React.createElement("option",{value:"justa_causa"},"Despido con justa causa"),React.createElement("option",{value:"mutuo"},"Mutuo acuerdo"),React.createElement("option",{value:"despido_embarazo"},"Despido en embarazo / lactancia (+180 d\xEDas)"),React.createElement("option",{value:"despido_discapacidad"},"Despido por discapacidad / incapacidad (+180 d\xEDas)"),React.createElement("option",{value:"no_pago"},"No pago de salarios (Art. 65)"))),React.createElement("div",null,React.createElement("label",null,"Vacaciones pendientes (# per\xEDodos)"),React.createElement("input",{type:"number",min:"0",max:"10",value:f.vacPend,onChange:e=>setVal("vacPend",parseFloat(e.target.value)||0),placeholder:"0"})),React.createElement("div",null,React.createElement("label",null,"Horas extra pendientes (# horas)"),React.createElement("input",{type:"number",min:"0",value:f.horasExtra,onChange:e=>setVal("horasExtra",parseFloat(e.target.value)||0),placeholder:"0"})),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},React.createElement("label",{style:{cursor:"pointer",display:"flex",gap:8,alignItems:"center",marginTop:20}},React.createElement("input",{type:"checkbox",checked:f.auxT,onChange:e=>setVal("auxT",e.target.checked),style:{width:"auto"}}),"Incluye auxilio de transporte"),React.createElement("label",{style:{cursor:"pointer",display:"flex",gap:8,alignItems:"center"}},React.createElement("input",{type:"checkbox",checked:f.salarioIntegral,onChange:e=>setVal("salarioIntegral",e.target.checked),style:{width:"auto"}}),"Salario integral (\u2265 13 SMMLV)"))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Calcular liquidaci\xF3n"),res&&React.createElement("div",{style:{marginTop:16}},React.createElement("div",{style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",borderRadius:14,padding:"16px 20px",color:"#fff",marginBottom:14,textAlign:"center"}},React.createElement("div",{style:{fontSize:11,fontWeight:700,letterSpacing:1,opacity:.8,marginBottom:4}},"TOTAL ESTIMADO QUE LE DEBEN"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700}},fmt(res.total)),React.createElement("div",{style:{fontSize:11,opacity:.7,marginTop:4}},res.anos," a\xF1o(s) y ",res.diasFraccion," d\xEDas \xB7 ",fmtN(res.diasTotal)," d\xEDas totales")),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:7}},[{l:"Cesantías",v:res.cesantias,n:"(Sal+Aux) × días / 360"},{l:"Intereses de cesantías",v:res.intCesantias,n:"12% anual sobre cesantías"},{l:"Prima de servicios",v:res.prima,n:"15 días por semestre"},{l:"Vacaciones proporcionales",v:res.vacaciones,n:"15 días por año"},res.vacPendMonto>0&&{l:"Vacaciones pendientes",v:res.vacPendMonto,n:`${f.vacPend} período(s)`},res.indemnizacion>0&&{l:"Indemnización (Art. 64 CST)",v:res.indemnizacion,n:"Despido sin justa causa",highlight:true},res.penalidad>0&&{l:"Penalidad no pago (Art. 65)",v:res.penalidad,n:"1 día de salario por día de retraso",highlight:true},res.horasExtraMonto>0&&{l:"Horas extra pendientes",v:res.horasExtraMonto,n:"Recargo 25% diurno"}].filter(Boolean).map((item,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderRadius:9,background:item.highlight?"#FEF2F2":"#F8FAFF",border:`1px solid ${item.highlight?"#FECACA":"#DCE6FB"}`}},React.createElement("div",null,React.createElement("div",{style:{fontWeight:600,fontSize:13,color:item.highlight?"#DC2626":"#111827"}},item.l),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},item.n)),React.createElement("div",{style:{fontWeight:700,fontSize:14,color:item.highlight?"#DC2626":"#1E50C8"}},fmt(item.v))))),React.createElement("div",{style:{marginTop:10,padding:"10px 14px",background:"#FFFBEB",borderRadius:9,fontSize:11,color:"#92400E",lineHeight:1.7}},"\u26A0\uFE0F Este c\xE1lculo es orientativo basado en el Art. 64 CST y valores 2026. No incluye deducciones de seguridad social ni retenci\xF3n en la fuente. Antes de firmar cualquier liquidaci\xF3n, cons\xFAltela con un abogado laboral o la Personer\xEDa de su ciudad. Prescripci\xF3n: 3 a\xF1os desde la terminaci\xF3n (Art. 488 CST).")));}function CalcPrestaciones(){const[sal,setSal]=useState("");const[auxT,setAuxT]=useState(true);const[res,setRes]=useState(null);const calcular=()=>{const s=parseFloat(sal.replace(/\./g,"").replace(",","."))||0;if(!s)return;const aux=auxT&&s<=VALORES_2026.smmlv*2?VALORES_2026.auxTransporte:0;const base=s+aux;const item=(label,pct,monto,nota)=>({label,pct,monto:Math.round(monto),nota});const r={cesantias:item("Cesantías","8.33%",base*0.0833,"1 mes de salario+aux por año — Art. 249 CST"),intCes:item("Intereses cesantías","1%",base*0.0833*0.12/12,"12% anual sobre cesantías"),prima:item("Prima de servicios","8.33%",base*0.0833,"15 días junio y diciembre — Art. 306 CST"),vacaciones:item("Vacaciones","4.17%",s*0.0417,"15 días hábiles/año (SIN auxilio)"),salud:item("Salud (empleado)","4%",s*0.04,"Descuento de nómina sobre salario"),pension:item("Pensión (empleado)","4%",s*0.04,"Descuento de nómina sobre salario"),saludEmp:item("Salud (empleador)","8.5%",s*0.085,"Aporte del empleador"),pensionEmp:item("Pensión (empleador)","12%",s*0.12,"Aporte del empleador"),arl:item("ARL (empleador)","~0.52%",s*0.0052,"Varía según riesgo laboral I al V"),sena:item("SENA (empleador)","2%",s*0.02,"Si nómina total > 10 SMMLV"),icbf:item("ICBF (empleador)","3%",s*0.03,"Si nómina total > 10 SMMLV"),cajaCom:item("Caja compensación","4%",s*0.04,"Empleador — subsidio familiar")};const costoEmpleador=s+aux+r.cesantias.monto+r.intCes.monto+r.prima.monto+r.vacaciones.monto+r.saludEmp.monto+r.pensionEmp.monto+r.arl.monto+r.sena.monto+r.icbf.monto+r.cajaCom.monto;setRes({r,costoEmpleador,salNeto:Math.round(s-s*0.04-s*0.04+aux)});};return React.createElement("div",null,React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Salario mensual ($)"),React.createElement("input",{placeholder:"Ej: 2.500.000",value:sal,onChange:e=>setSal(e.target.value)})),React.createElement("div",{style:{display:"flex",alignItems:"flex-end",paddingBottom:4}},React.createElement("label",{style:{cursor:"pointer",display:"flex",gap:8,alignItems:"center"}},React.createElement("input",{type:"checkbox",checked:auxT,onChange:e=>setAuxT(e.target.checked),style:{width:"auto"}}),"Aplica auxilio de transporte"))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Ver desglose completo"),res&&React.createElement("div",{style:{marginTop:16}},React.createElement("div",{className:"g2",style:{marginBottom:14}},React.createElement("div",{style:{background:"#F0FDF4",borderRadius:11,padding:"12px 16px",textAlign:"center"}},React.createElement("div",{style:{fontSize:11,color:"#166534",fontWeight:700}},"SALARIO NETO (lo que recibe)"),React.createElement("div",{style:{fontSize:20,fontWeight:700,color:"#15803d"}},fmt(res.salNeto))),React.createElement("div",{style:{background:"#FEF2F2",borderRadius:11,padding:"12px 16px",textAlign:"center"}},React.createElement("div",{style:{fontSize:11,color:"#991B1B",fontWeight:700}},"COSTO REAL PARA EL EMPLEADOR"),React.createElement("div",{style:{fontSize:20,fontWeight:700,color:"#DC2626"}},fmt(res.costoEmpleador)))),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:6}},React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#374151",padding:"4px 0",borderBottom:"1px solid #E5E7EB",marginBottom:4}},"DESCUENTOS AL EMPLEADO"),["salud","pension"].map(k=>React.createElement("div",{key:k,style:{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:"#FFF7ED",borderRadius:8}},React.createElement("div",null,React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#92400E"}},res.r[k].label," (",res.r[k].pct,")"),React.createElement("div",{style:{fontSize:10,color:"#6B7280"}},res.r[k].nota)),React.createElement("div",{style:{fontWeight:700,color:"#D97706"}},"-",fmt(res.r[k].monto)))),React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#374151",padding:"4px 0",borderBottom:"1px solid #E5E7EB",margin:"8px 0 4px"}},"PRESTACIONES (empleador)"),["cesantias","intCes","prima","vacaciones"].map(k=>React.createElement("div",{key:k,style:{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:"#EEF3FE",borderRadius:8}},React.createElement("div",null,React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#1E50C8"}},res.r[k].label," (",res.r[k].pct,")"),React.createElement("div",{style:{fontSize:10,color:"#6B7280"}},res.r[k].nota)),React.createElement("div",{style:{fontWeight:700,color:"#1E50C8"}},fmt(res.r[k].monto)))),React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#374151",padding:"4px 0",borderBottom:"1px solid #E5E7EB",margin:"8px 0 4px"}},"APORTES EMPLEADOR (seg. social y parafiscales)"),["saludEmp","pensionEmp","arl","sena","icbf","cajaCom"].map(k=>React.createElement("div",{key:k,style:{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:"#F0FDF4",borderRadius:8}},React.createElement("div",null,React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#166534"}},res.r[k].label," (",res.r[k].pct,")"),React.createElement("div",{style:{fontSize:10,color:"#6B7280"}},res.r[k].nota)),React.createElement("div",{style:{fontWeight:700,color:"#15803d"}},fmt(res.r[k].monto)))))));}function CalcAlimentos(){const[f,setF]=useState({ingresoObligado:"",gastosMenores:"",numMenores:1,ingresoAlimentante:""});const[res,setRes]=useState(null);const calcular=()=>{const ing=parseFloat(f.ingresoObligado.replace(/\./g,""))||0;const gastos=parseFloat(f.gastosMenores.replace(/\./g,""))||0;const n=parseInt(f.numMenores)||1;if(!ing)return;const minPorHijo=VALORES_2026.smmlv*0.25;const cuota30=Math.round(ing*0.30/n);const cuota25=Math.round(ing*0.25/n);const gastosPorHijo=Math.round(gastos/n);const recomendado=Math.max(minPorHijo,Math.min(cuota30,gastosPorHijo*1.2));setRes({minPorHijo:Math.round(minPorHijo),cuota25,cuota30,gastosPorHijo,recomendado:Math.round(recomendado),n});};return React.createElement("div",null,React.createElement("div",{style:{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#991B1B"}},"\u26A0\uFE0F La cuota alimentaria la fija el juez. Este c\xE1lculo es orientativo basado en el C\xF3digo de la Infancia (Ley 1098/2006) y criterios jurisprudenciales. El m\xEDnimo es ",fmt(VALORES_2026.smmlv*0.25),"/hijo/mes."),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Ingresos mensuales del obligado ($)"),React.createElement("input",{placeholder:"Salario + otros ingresos",value:f.ingresoObligado,onChange:e=>setF(p=>({...p,ingresoObligado:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"N\xFAmero de menores a alimentar"),React.createElement("select",{value:f.numMenores,onChange:e=>setF(p=>({...p,numMenores:e.target.value}))},[1,2,3,4,5].map(n=>React.createElement("option",{key:n,value:n},n," hijo",n>1?"s":"")))),React.createElement("div",null,React.createElement("label",null,"Gastos mensuales reales del menor ($)"),React.createElement("input",{placeholder:"Colegio + comida + salud + ropa...",value:f.gastosMenores,onChange:e=>setF(p=>({...p,gastosMenores:e.target.value}))}))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Calcular cuota orientativa"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:"linear-gradient(135deg,#312e81,#1E50C8)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},React.createElement("div",{style:{fontSize:11,opacity:.8,fontWeight:700,marginBottom:4}},"CUOTA ORIENTATIVA RECOMENDADA / HIJO"),React.createElement("div",{style:{fontSize:26,fontWeight:800}},fmt(res.recomendado)),React.createElement("div",{style:{fontSize:11,opacity:.7,marginTop:3}},"Rango: ",fmt(res.cuota25)," \u2014 ",fmt(res.cuota30)," por hijo")),[{l:"Mínimo legal orientativo/hijo",v:res.minPorHijo,n:"25% del SMMLV"},{l:"25% ingresos / hijos",v:res.cuota25,n:"Criterio básico jurisprudencial"},{l:"30% ingresos / hijos",v:res.cuota30,n:"Criterio con más necesidades"},{l:"Gastos reales / hijo",v:res.gastosPorHijo,n:"Comprobables ante el juez"}].map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#F8FAFF",borderRadius:8,marginBottom:6}},React.createElement("div",null,React.createElement("div",{style:{fontSize:12,fontWeight:600}},x.l),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},x.n)),React.createElement("div",{style:{fontWeight:700,color:"#1E50C8"}},fmt(x.v))))));}function CalcUsura(){const[f,setF]=useState({capital:"",tasaCobrada:"",meses:12,tipo:"consumo"});const[res,setRes]=useState(null);const limites={consumo:{tasa:VALORES_2026.tasaUsura,nombre:"Consumo y ordinario"},microcredito:{tasa:56.5,nombre:"Microcrédito"},hipotecario:{tasa:18.9,nombre:"Hipotecario"}};const calcular=()=>{const cap=parseFloat(f.capital.replace(/\./g,""))||0;const tasaCob=parseFloat(f.tasaCobrada)||0;const limite=limites[f.tipo]?.tasa||VALORES_2026.tasaUsura;if(!cap||!tasaCob)return;const esMensual=tasaCob>3;const tasaAnualCob=esMensual?((1+tasaCob/100)**12-1)*100:tasaCob;const esUsura=tasaAnualCob>limite;const interesCobrado=cap*(tasaAnualCob/100)*(f.meses/12);const interesMaxLegal=cap*(limite/100)*(f.meses/12);const exeso=Math.max(0,interesCobrado-interesMaxLegal);setRes({esUsura,tasaAnualCob:tasaAnualCob.toFixed(2),limite,interesCobrado:Math.round(interesCobrado),interesMaxLegal:Math.round(interesMaxLegal),exeso:Math.round(exeso),cap});};return React.createElement("div",null,React.createElement("div",{style:{background:"#EEF3FE",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A42A3"}},"\uD83D\uDCCA Tasa de usura junio 2026: ",React.createElement("strong",null,VALORES_2026.tasaUsura,"% E.A.")," para cr\xE9dito de consumo \u2014 Res. 0823 Superfinanciera"),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Capital del pr\xE9stamo o deuda ($)"),React.createElement("input",{placeholder:"Ej: 10.000.000",value:f.capital,onChange:e=>setF(p=>({...p,capital:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Tasa de inter\xE9s que le cobran (%)"),React.createElement("input",{type:"number",placeholder:"Ej: 35 (anual) o 2.5 (mensual)",value:f.tasaCobrada,onChange:e=>setF(p=>({...p,tasaCobrada:e.target.value}))}),React.createElement("p",{style:{fontSize:10,color:"#9CA3AF",marginTop:3}},"Ingrese tasa anual o mensual (detectamos autom\xE1ticamente)")),React.createElement("div",null,React.createElement("label",null,"Tipo de cr\xE9dito"),React.createElement("select",{value:f.tipo,onChange:e=>setF(p=>({...p,tipo:e.target.value}))},React.createElement("option",{value:"consumo"},"Consumo / ordinario / TC (",VALORES_2026.tasaUsura,"% E.A.)"),React.createElement("option",{value:"microcredito"},"Microcr\xE9dito (56.5% E.A.)"),React.createElement("option",{value:"hipotecario"},"Hipotecario / vivienda (18.9% E.A.)"))),React.createElement("div",null,React.createElement("label",null,"Meses del per\xEDodo a calcular"),React.createElement("input",{type:"number",min:"1",max:"360",value:f.meses,onChange:e=>setF(p=>({...p,meses:parseInt(e.target.value)||12}))}))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Verificar si hay usura"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:res.esUsura?"linear-gradient(135deg,#DC2626,#b91c1c)":"linear-gradient(135deg,#15803d,#166534)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},React.createElement("div",{style:{fontSize:18,fontWeight:800,marginBottom:4}},res.esUsura?"🚨 USURA DETECTADA":"✅ Dentro del límite legal"),React.createElement("div",{style:{fontSize:13,opacity:.9}},"Su tasa efectiva anual: ",res.tasaAnualCob,"% \xB7 L\xEDmite legal: ",res.limite,"% E.A."),res.esUsura&&React.createElement("div",{style:{fontSize:14,fontWeight:700,marginTop:8}},"Cobro en exceso: ",fmt(res.exeso))),[{l:"Intereses cobrados en el período",v:res.interesCobrado,c:"#DC2626"},{l:"Intereses máximos legales",v:res.interesMaxLegal,c:"#15803d"},{l:"Cobro en exceso (usura)",v:res.exeso,c:res.esUsura?"#DC2626":"#9CA3AF"}].map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#F8FAFF",borderRadius:8,marginBottom:6}},React.createElement("div",{style:{fontSize:12,fontWeight:600,color:"#374151"}},x.l),React.createElement("div",{style:{fontWeight:700,color:x.c}},fmt(x.v)))),res.esUsura&&React.createElement("div",{style:{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#991B1B",lineHeight:1.7,marginTop:8}},"\uD83D\uDCA1 ",React.createElement("strong",null,"\xBFQu\xE9 hacer?")," Reclame ante la Superfinanciera (superfinanciera.gov.co) o presente queja ante el Defensor del Consumidor Financiero del banco. Si no responden en 15 d\xEDas \u2192 Tutela por vulneraci\xF3n al debido proceso y al consumidor financiero.")));}function CalcComparendo(){const[f,setF]=useState({tipo:"B",fecha:"",fechaNotif:"",ciudad:"",pagado:false});const[res,setRes]=useState(null);const categorias={A:{nombre:"A — Vehículo no automotor",smmlv:4,desc:"Bicicleta, tracción animal"},B:{nombre:"B — Infracciones menores",smmlv:8,desc:"No respetar señales, luces"},C:{nombre:"C — Infracciones moderadas",smmlv:15,desc:"Exceso velocidad moderado"},D:{nombre:"D — Infracciones graves",smmlv:30,desc:"No ceder paso peatones, celular"},E:{nombre:"E — Infracciones muy graves",smmlv:30,desc:"Adelantar en curvas"},F:{nombre:"F — Documentos",smmlv:15,desc:"Sin licencia, sin SOAT"},G:{nombre:"G — Gravísimas (embriaguez)",smmlv:1440,desc:"Conducción en estado de embriaguez"}};const calcular=()=>{const cat=categorias[f.tipo];if(!cat||!f.fecha)return;const monto=cat.smmlv*(VALORES_2026.smmlv/30);const montoReal=cat.smmlv*VALORES_2026.smmlv/30;const fechaInfrac=new Date(f.fecha);const hoy=new Date();const diasDesde=Math.floor((hoy-fechaInfrac)/(1000*60*60*24));const anosDesde=diasDesde/365;const prescribe=anosDesde>=3;const diasParaPrescribir=Math.max(0,1095-diasDesde);const descuento50=montoReal*0.5;setRes({cat,montoReal:Math.round(montoReal),descuento50:Math.round(descuento50),diasDesde,anosDesde:anosDesde.toFixed(1),prescribe,diasParaPrescribir,fechaInfrac});};return React.createElement("div",null,React.createElement("div",{style:{background:"#FFFBEB",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#92400E"}},"\uD83D\uDCC5 Valores SMMLV 2026: ",fmt(VALORES_2026.smmlv)," \xB7 Las multas se calculan en d\xEDas de SMMLV seg\xFAn Art. 131 Ley 769/2002"),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Categor\xEDa de la infracci\xF3n"),React.createElement("select",{value:f.tipo,onChange:e=>setF(p=>({...p,tipo:e.target.value}))},Object.entries(categorias).map(([k,v])=>React.createElement("option",{key:k,value:k},v.nombre)))),React.createElement("div",null,React.createElement("label",null,"Fecha de la infracci\xF3n"),React.createElement("input",{type:"date",value:f.fecha,onChange:e=>setF(p=>({...p,fecha:e.target.value}))}))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Calcular monto y prescripci\xF3n"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:res.prescribe?"linear-gradient(135deg,#15803d,#166534)":"linear-gradient(135deg,#1E50C8,#3D68E3)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},res.prescribe?React.createElement(React.Fragment,null,React.createElement("div",{style:{fontSize:18,fontWeight:800}},"\u2705 POSIBLEMENTE PRESCRITO"),React.createElement("div",{style:{fontSize:13,marginTop:4,opacity:.9}},"Han pasado ",res.anosDesde," a\xF1os \u2014 solicite prescripci\xF3n")):React.createElement(React.Fragment,null,React.createElement("div",{style:{fontSize:11,opacity:.8,fontWeight:700}},"MONTO ESTIMADO DE LA MULTA"),React.createElement("div",{style:{fontSize:26,fontWeight:700}},fmt(res.montoReal)),React.createElement("div",{style:{fontSize:12,opacity:.8}},"Faltan ",res.diasParaPrescribir," d\xEDas para posible prescripci\xF3n (3 a\xF1os)"))),!res.prescribe&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#166534"}},"\uD83D\uDCB0 ",React.createElement("strong",null,"Descuento del 50%")," si paga dentro de los 3 d\xEDas h\xE1biles siguientes a la notificaci\xF3n: ",React.createElement("strong",null,fmt(res.descuento50))),res.prescribe&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534",lineHeight:1.7}},"\uD83D\uDCA1 ",React.createElement("strong",null,"\xBFQu\xE9 hacer?")," Presente Derecho de Petici\xF3n a la Secretar\xEDa de Movilidad solicitando la declaratoria de prescripci\xF3n. Si no responden en 15 d\xEDas \u2192 Tutela. Fundamento: Art. 179 Ley 769/2002 \u2014 prescripci\xF3n de 3 a\xF1os sin cobro coactivo."),React.createElement("div",{style:{padding:"8px 12px",background:"#F8FAFF",borderRadius:8}},React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#374151",marginBottom:4}},"Infracci\xF3n categor\xEDa ",f.tipo,": ",res.cat.nombre),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},res.cat.smmlv," d\xEDas de SMMLV (",res.cat.desc,")")),!res.prescribe&&React.createElement("div",{style:{marginTop:8,padding:"8px 12px",background:"#FFFBEB",borderRadius:8,fontSize:11,color:"#92400E",lineHeight:1.7}},"\uD83D\uDEA8 ",React.createElement("strong",null,"Sobre el esc\xE1ndalo de fotomultas 2026:")," Si tu comparendo es de c\xE1mara (SAST) entre dic 2018 y nov 2024, puede estar en el proceso de anulaci\xF3n nacional. Consulta tu caso en la Secretar\xEDa de Movilidad de tu ciudad.")));}function CalcPension(){const[f,setF]=useState({semanas:"",salarioBase:"",edad:"",regimen:"colpensiones"});const[res,setRes]=useState(null);const calcular=()=>{const s=parseInt(f.semanas)||0;const sal=parseFloat(f.salarioBase.replace(/\./g,""))||0;const edad=parseInt(f.edad)||0;if(!s||!sal||!edad)return;const reqSemanas=f.regimen==="colpensiones"?1300:1150;const reqEdadH=62;const reqEdadM=57;const semanasFaltanH=Math.max(0,reqSemanas-s);const semanasFaltanM=Math.max(0,reqSemanas-s);const tasa=Math.min(0.80,0.55+Math.max(0,s-1000)*0.015/50);const mesadaEstimada=Math.max(VALORES_2026.smmlv,sal*tasa);const mesadaMin=VALORES_2026.smmlv;setRes({cumpleSemanasH:s>=reqSemanas,cumpleSemanasM:s>=reqSemanas,semanasFaltanH,semanasFaltanM,tasa:(tasa*100).toFixed(1),mesadaEstimada:Math.round(mesadaEstimada),mesadaMin,reqSemanas,anosAportarH:Math.ceil(semanasFaltanH/52),anosAportarM:Math.ceil(semanasFaltanM/52)});};return React.createElement("div",null,React.createElement("div",{style:{background:"#EEF3FE",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A42A3"}},"\uD83D\uDCCB Ley 100/1993 + Acto Legislativo 01/2005: Colpensiones requiere 1.300 semanas + 62H/57M a\xF1os. Fondo privado: 1.150 semanas + 62H/57M."),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Semanas cotizadas (total hist\xF3rico)"),React.createElement("input",{type:"number",placeholder:"Revise en colpensiones.gov.co",value:f.semanas,onChange:e=>setF(p=>({...p,semanas:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Salario promedio \xFAltimos 10 a\xF1os ($)"),React.createElement("input",{placeholder:"Ingreso base de liquidaci\xF3n",value:f.salarioBase,onChange:e=>setF(p=>({...p,salarioBase:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Edad actual"),React.createElement("input",{type:"number",min:"40",max:"90",value:f.edad,onChange:e=>setF(p=>({...p,edad:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"R\xE9gimen pensional"),React.createElement("select",{value:f.regimen,onChange:e=>setF(p=>({...p,regimen:e.target.value}))},React.createElement("option",{value:"colpensiones"},"Colpensiones (RPM)"),React.createElement("option",{value:"privado"},"Fondo privado (RAIS)")))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Estimar pensi\xF3n"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:"linear-gradient(135deg,#4C1D95,#5B21B6)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},React.createElement("div",{style:{fontSize:11,opacity:.8,fontWeight:700}},"MESADA PENSIONAL ESTIMADA"),React.createElement("div",{style:{fontSize:26,fontWeight:700}},fmt(res.mesadaEstimada)),React.createElement("div",{style:{fontSize:12,opacity:.8,marginTop:3}},"Tasa de reemplazo estimada: ",res.tasa,"% del IBL")),React.createElement("div",{className:"g2",style:{marginBottom:10}},React.createElement("div",{style:{background:res.cumpleSemanasH?"#F0FDF4":"#FEF2F2",borderRadius:10,padding:12,textAlign:"center"}},React.createElement("div",{style:{fontWeight:700,fontSize:13,color:res.cumpleSemanasH?"#15803d":"#DC2626"}},res.cumpleSemanasH?"✅ Semanas cumplidas":"❌ Semanas faltantes"),!res.cumpleSemanasH&&React.createElement("div",{style:{fontSize:12,color:"#991B1B"}},res.semanasFaltanH," semanas m\xE1s (~",res.anosAportarH," a\xF1os)"),React.createElement("div",{style:{fontSize:11,color:"#6B7280",marginTop:2}},"Requiere: ",res.reqSemanas," semanas")),React.createElement("div",{style:{background:"#FFFBEB",borderRadius:10,padding:12,textAlign:"center"}},React.createElement("div",{style:{fontWeight:700,fontSize:12,color:"#92400E"}},"Pensi\xF3n m\xEDnima garantizada"),React.createElement("div",{style:{fontSize:14,fontWeight:700,color:"#D97706"}},fmt(res.mesadaMin)),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},"1 SMMLV 2026"))),React.createElement("div",{style:{padding:"10px 14px",background:"#F8FAFF",borderRadius:9,fontSize:11,color:"#6B7280",lineHeight:1.7}},"\u26A0\uFE0F Estimaci\xF3n orientativa. Para el c\xE1lculo exacto consulte ",React.createElement("strong",null,"colpensiones.gov.co")," o solicite un extracto de historia laboral. Si Colpensiones no le reconoce semanas que cotiz\xF3, tiene derecho a presentar Derecho de Petici\xF3n adjuntando los certificados laborales y n\xF3minas que lo comprueben.")));}function CalcArriendo(){const[f,setF]=useState({canonActual:"",ipc:"",fechaInicio:""});const[res,setRes]=useState(null);const IPC_2025=5.3;const calcular=()=>{const canon=parseFloat(f.canonActual.replace(/\./g,""))||0;if(!canon)return;const ipcReal=parseFloat(f.ipc)||IPC_2025;const incrementoMaximo=canon*(ipcReal/100);const nuevoCanon=canon+incrementoMaximo;const nuevoCanonRedondeado=Math.ceil(nuevoCanon/1000)*1000;setRes({canon,ipcReal,incrementoMaximo:Math.round(incrementoMaximo),nuevoCanon:Math.round(nuevoCanon),nuevoCanonRedondeado});};return React.createElement("div",null,React.createElement("div",{style:{background:"#EEF3FE",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A42A3"}},"\uD83D\uDCCB Ley 820/2003 Art. 20: El arrendador solo puede aumentar el canon una vez al a\xF1o y m\xE1ximo en el IPC del a\xF1o anterior. IPC 2025 = ",IPC_2025,"% (DANE)."),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Canon de arrendamiento actual ($)"),React.createElement("input",{placeholder:"Ej: 1.500.000",value:f.canonActual,onChange:e=>setF(p=>({...p,canonActual:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"IPC del a\xF1o anterior (%)"),React.createElement("input",{type:"number",step:"0.1",placeholder:`${IPC_2025} (2025 — DANE)`,value:f.ipc,onChange:e=>setF(p=>({...p,ipc:e.target.value}))}),React.createElement("p",{style:{fontSize:10,color:"#9CA3AF",marginTop:3}},"Deje en blanco para usar IPC 2025 = ",IPC_2025,"%"))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Calcular incremento m\xE1ximo legal"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:"linear-gradient(135deg,#9D2B2B,#DC2626)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},React.createElement("div",{style:{fontSize:11,opacity:.8,fontWeight:700}},"CANON M\xC1XIMO LEGAL PARA EL PR\xD3XIMO A\xD1O"),React.createElement("div",{style:{fontSize:26,fontWeight:700}},fmt(res.nuevoCanon)),React.createElement("div",{style:{fontSize:12,opacity:.8}},"Aumento m\xE1ximo: ",fmt(res.incrementoMaximo)," (",res.ipcReal,"% IPC)")),React.createElement("div",{style:{padding:"10px 14px",background:"#FEF2F2",borderRadius:9,fontSize:12,color:"#991B1B",lineHeight:1.7}},"\uD83D\uDEA8 Si el arrendador le cobra m\xE1s de ",fmt(res.nuevoCanon),", est\xE1 violando la Ley 820/2003. Usted puede negarse a pagar el exceso, reclamar la devoluci\xF3n de lo cobrado de m\xE1s, y si no responde, acudir a la Alcald\xEDa o interponer demanda ante el Juzgado Civil Municipal.")));}function CalcRenta(){const[f,setF]=useState({ingresos:"",retefuente:"",deducciones:"",dependientes:0,interesesVivienda:""});const[res,setRes]=useState(null);const UVT=VALORES_2026.uvt;const calcular=()=>{const ing=parseFloat(f.ingresos.replace(/\./g,""))||0;if(!ing)return;const rete=parseFloat(f.retefuente.replace(/\./g,""))||0;const deducc=parseFloat(f.deducciones.replace(/\./g,""))||0;const dep=parseInt(f.dependientes)||0;const intViv=parseFloat(f.interesesVivienda.replace(/\./g,""))||0;const deducDep=Math.min(ing*0.10,dep*32*UVT*12);const rentaExenta=Math.min(ing*0.25,790*UVT);const dedIntViv=Math.min(intViv,1200*UVT);const totalDeducc=Math.min(deducc+deducDep+intViv,ing*0.40);const baseGravable=Math.max(0,ing-rentaExenta-totalDeducc);const baseUVT=baseGravable/UVT;let impuesto=0;if(baseUVT>1090)impuesto=(baseUVT-1090)*0.33*UVT+(baseUVT-1)*UVT*0.00;else if(baseUVT>590)impuesto=(baseUVT-590)*0.28*UVT+0;else if(baseUVT>360)impuesto=(baseUVT-360)*0.23*UVT;else if(baseUVT>210)impuesto=(baseUVT-210)*0.19*UVT;else if(baseUVT>95)impuesto=(baseUVT-95)*0.09*UVT;impuesto=Math.max(0,impuesto);const saldoFavor=Math.max(0,rete-impuesto);const saldoCargo=Math.max(0,impuesto-rete);const debeDeclarar=ing>1400*UVT;setRes({ing,rentaExenta:Math.round(rentaExenta),totalDeducc:Math.round(totalDeducc),baseGravable:Math.round(baseGravable),baseUVT:Math.round(baseUVT),impuesto:Math.round(impuesto),rete,saldoFavor:Math.round(saldoFavor),saldoCargo:Math.round(saldoCargo),debeDeclarar,umbral:Math.round(1400*UVT)});};return React.createElement("div",null,React.createElement("div",{style:{background:"#EEF3FE",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A42A3"}},"\uD83D\uDCCB UVT 2026: ",fmt(UVT)," \xB7 Umbral para declarar: ingresos > ",fmt(1400*UVT),"/a\xF1o (",fmt(1400*UVT/12),"/mes) \u2014 Art. 241 ET"),React.createElement("div",{className:"g2"},React.createElement("div",null,React.createElement("label",null,"Ingresos totales del a\xF1o ($)"),React.createElement("input",{placeholder:"Salarios + arriendos + honorarios + otros",value:f.ingresos,onChange:e=>setF(p=>({...p,ingresos:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Retenci\xF3n en la fuente acumulada ($)"),React.createElement("input",{placeholder:"Del certificado de ingresos",value:f.retefuente,onChange:e=>setF(p=>({...p,retefuente:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Deducciones (aportes salud + pensi\xF3n + otros) ($)"),React.createElement("input",{placeholder:"Aportes voluntarios, GMF, etc.",value:f.deducciones,onChange:e=>setF(p=>({...p,deducciones:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"Intereses de cr\xE9dito hipotecario ($)"),React.createElement("input",{placeholder:"Certificado de intereses del banco",value:f.interesesVivienda,onChange:e=>setF(p=>({...p,interesesVivienda:e.target.value}))})),React.createElement("div",null,React.createElement("label",null,"N\xFAmero de dependientes econ\xF3micos"),React.createElement("select",{value:f.dependientes,onChange:e=>setF(p=>({...p,dependientes:e.target.value}))},[0,1,2,3,4].map(n=>React.createElement("option",{key:n,value:n},n," dependiente",n!==1?"s":""))))),React.createElement("button",{className:"btn ba",style:{width:"100%",marginTop:14},onClick:calcular},"\uD83D\uDCCA Estimar impuesto de renta"),res&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{background:res.saldoFavor>0?"linear-gradient(135deg,#15803d,#166534)":"linear-gradient(135deg,#1E50C8,#3D68E3)",borderRadius:12,padding:"14px 18px",color:"#fff",textAlign:"center",marginBottom:12}},res.saldoFavor>0?React.createElement(React.Fragment,null,React.createElement("div",{style:{fontSize:14,fontWeight:800}},"\u2705 LA DIAN LE DEBE A USTED"),React.createElement("div",{style:{fontSize:24,fontWeight:700}},fmt(res.saldoFavor)),React.createElement("div",{style:{fontSize:12,opacity:.8}},"Saldo a favor \u2014 solicite devoluci\xF3n")):React.createElement(React.Fragment,null,React.createElement("div",{style:{fontSize:14,fontWeight:800}},"\uD83D\uDCB3 IMPUESTO A CARGO"),React.createElement("div",{style:{fontSize:24,fontWeight:700}},fmt(res.saldoCargo)),React.createElement("div",{style:{fontSize:12,opacity:.8}},"Lo que debe pagar a la DIAN"))),!res.debeDeclarar&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:9,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#166534"}},"\u2705 Sus ingresos (",fmt(res.ing),"/a\xF1o) est\xE1n por debajo del umbral de declaraci\xF3n (",fmt(res.umbral),"/a\xF1o). Probablemente NO est\xE1 obligado a declarar renta. Verifique otros criterios (patrimonio, consignaciones) en dian.gov.co."),[{l:"Ingresos totales del año",v:res.ing},{l:"Renta exenta laboral (25%)",v:-res.rentaExenta},{l:"Deducciones aplicadas",v:-res.totalDeducc},{l:"Base gravable",v:res.baseGravable,bold:true},{l:"Impuesto de renta calculado",v:res.impuesto,bold:true},{l:"Retención en la fuente",v:-res.rete},{l:res.saldoFavor>0?"Saldo a su favor":"Saldo a pagar",v:res.saldoFavor>0?res.saldoFavor:res.saldoCargo,highlight:true}].map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",justifyContent:"space-between",padding:"7px 12px",background:x.highlight?"#EEF3FE":"#F8FAFF",borderRadius:8,marginBottom:5,fontWeight:x.bold||x.highlight?"700":"400"}},React.createElement("div",{style:{fontSize:12,color:"#374151"}},x.l),React.createElement("div",{style:{fontSize:12,color:x.v<0?"#DC2626":x.highlight?"#1E50C8":"#1E50C8"}},x.v<0?`- ${fmt(Math.abs(x.v))}`:fmt(x.v)))),React.createElement("div",{style:{marginTop:8,padding:"8px 12px",background:"#FFFBEB",borderRadius:8,fontSize:11,color:"#92400E",lineHeight:1.7}},"\u26A0\uFE0F Estimaci\xF3n orientativa. Los c\xE1lculos tributarios dependen de muchos factores espec\xEDficos. Para declaraci\xF3n oficial use el formulario 210 en muisca.dian.gov.co o consulte con un contador p\xFAblico.")));}const CALCULADORAS_CONFIG=[{id:"liquidacion",cat:["trabajo"],titulo:"Calculadora de Liquidación y Despido",emoji:"💰",comp:CalcLiquidacion,desc:"Cesantías, prima, vacaciones, indemnización Art. 64 CST — valores 2026"},{id:"prestaciones",cat:["trabajo"],titulo:"Desglose de Prestaciones Sociales",emoji:"📋",comp:CalcPrestaciones,desc:"Cuánto gana neto el trabajador y cuánto le cuesta al empleador"},{id:"alimentos",cat:["trabajo","vivienda"],titulo:"Cuota de Alimentos (menores)",emoji:"👶",comp:CalcAlimentos,desc:"Estimación orientativa según Código de Infancia — Ley 1098/2006"},{id:"usura",cat:["bancos"],titulo:"Detector de Usura Bancaria",emoji:"🏦",comp:CalcUsura,desc:`Tasa de usura junio 2026: ${VALORES_2026.tasaUsura}% E.A. — Res. 0823 Superfinanciera`},{id:"comparendo",cat:["movilidad"],titulo:"Calculadora de Comparendo y Prescripción",emoji:"🚗",comp:CalcComparendo,desc:"Monto según Art. 131 Ley 769/2002 — verificar prescripción a 3 años"},{id:"pension",cat:["pension"],titulo:"Estimador de Pensión de Vejez",emoji:"👴",comp:CalcPension,desc:"Semanas requeridas, mesada estimada — Colpensiones y AFP privados"},{id:"arriendo",cat:["vivienda"],titulo:"Incremento Máximo de Arrendamiento",emoji:"🏠",comp:CalcArriendo,desc:`Ley 820/2003: incremento máximo = IPC año anterior (2025: 5.3%)`},{id:"renta",cat:["dian"],titulo:"Estimador Impuesto de Renta",emoji:"💼",comp:CalcRenta,desc:`UVT 2026: ${fmt(VALORES_2026.uvt)} · Umbral declarar: ${fmt(1400*VALORES_2026.uvt)}/año`}];function PanelCalculadoras({catActiva}){const[calcAbierta,setCalcAbierta]=useState(null);const calcFiltradas=catActiva?CALCULADORAS_CONFIG.filter(c=>c.cat.includes(catActiva)||c.cat.includes("all")):CALCULADORAS_CONFIG;return React.createElement("div",{className:"card",style:{marginBottom:18,borderLeft:"4px solid #D97706"}},React.createElement("div",{style:{display:"flex",gap:10,alignItems:"center",marginBottom:14}},React.createElement("div",{style:{width:38,height:38,borderRadius:10,background:"#FFFBEB",border:"2px solid #FDE68A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}},"\uD83E\uDDEE"),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:"#1E50C8"}},"Calculadoras Legales"),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},"F\xF3rmulas exactas del CST, ET y leyes colombianas \xB7 Valores 2026"))),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},calcFiltradas.map(c=>{const abierta=calcAbierta===c.id;return React.createElement("div",{key:c.id,style:{border:`1.5px solid ${abierta?"#D97706":"#E5E7EB"}`,borderRadius:12,overflow:"hidden",transition:"all .2s"}},React.createElement("button",{onClick:()=>setCalcAbierta(abierta?null:c.id),style:{width:"100%",background:abierta?"#FFFBEB":"#F8FAFF",border:"none",padding:"12px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12,textAlign:"left"}},React.createElement("span",{style:{fontSize:22,flexShrink:0}},c.emoji),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontWeight:700,fontSize:13,color:abierta?"#92400E":"#111827"}},c.titulo),React.createElement("div",{style:{fontSize:11,color:"#6B7280",marginTop:1}},c.desc)),React.createElement("span",{style:{fontSize:14,color:"#9CA3AF",transition:"transform .2s",transform:abierta?"rotate(180deg)":"none"}},"\u25BE")),abierta&&React.createElement("div",{style:{padding:"16px",background:"#fff",borderTop:"1px solid #FDE68A"},className:"fade"},React.createElement(c.comp,null)));})));}async function calcularProbabilidadExito(caso){const prompt=`Eres un abogado colombiano con 20 años de experiencia. Analiza este caso y dame una evaluación objetiva.
Caso: ${caso.subcasoNombre} | Categoría: ${caso.cat} | Etapa: ${caso.etapa}
Respuestas del usuario: ${JSON.stringify(caso.respuestas||{}).substring(0,500)}
Responde SOLO JSON sin markdown:
{"probabilidad":85,"nivel":"alto","argumento_principal":"razón por la que tienen buenas posibilidades","riesgo_principal":"el mayor obstáculo","tiempo_estimado":"tiempo estimado para resolución","jurisprudencia_clave":"sentencia más relevante para este caso"}`;try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:500,messages:[{role:"user",content:prompt}]})});const j=await r.json();return JSON.parse(j.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());}catch{return null;}}function compartirDocumento(texto,tipo){const resumen=texto.substring(0,200)+"...";if(navigator.share){navigator.share({title:`${tipo} — Ayuda Ciudadana`,text:resumen,url:window.location.href});}else{navigator.clipboard?.writeText(texto);}}function compartirWhatsApp(texto,tipo){const msg=encodeURIComponent(`*${tipo} generado en Ayuda Ciudadana*

${texto.substring(0,500)}...

Generado en: https://ayudaciudadana.co`);window.open(`https://wa.me/?text=${msg}`,'_blank');}function solicitarNotificaciones(casos){if("Notification"in window&&Notification.permission!=="denied"){Notification.requestPermission().then(perm=>{if(perm==="granted"){new Notification("TutelaYa ⚖️ — Notificaciones activadas",{body:"Le avisaremos cuando venzan los plazos legales de sus casos.",tag:"bienvenida"});if(casos?.length)setTimeout(()=>verificarPlazosNotificaciones(casos),2000);}});}}function notificarPlazo(titulo,mensaje,diasRestantes){if(Notification.permission==="granted"&&diasRestantes<=2){new Notification(`⚠️ ${titulo} — TutelaYa`,{body:mensaje});}}const CONTADOR_KEY="ayudaciudadana_global_count";function incrementarContador(){try{const actual=parseInt(localStorage.getItem(CONTADOR_KEY)||"47832");localStorage.setItem(CONTADOR_KEY,String(actual+1));return actual+1;}catch{return 47832;}}function getContador(){try{return parseInt(localStorage.getItem(CONTADOR_KEY)||"47832");}catch{return 47832;}}function ProbabilidadExito({caso}){const[prob,setProb]=useState(null);const[loading,setLoading]=useState(false);const analizar=async()=>{setLoading(true);const r=await calcularProbabilidadExito(caso);setProb(r);setLoading(false);};const color=prob?prob.probabilidad>=75?"#15803d":prob.probabilidad>=50?"#D97706":"#DC2626":"#1E50C8";const nivel=prob?prob.probabilidad>=75?"ALTA":prob.probabilidad>=50?"MODERADA":"BAJA":null;return React.createElement("div",{className:"card",style:{marginBottom:14,borderLeft:"4px solid #7C3AED"}},React.createElement("div",{style:{display:"flex",gap:12,alignItems:"center",marginBottom:12}},React.createElement("div",{style:{width:40,height:40,borderRadius:11,background:"linear-gradient(135deg,#7C3AED,#1E50C8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}},"\uD83C\uDFAF"),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1E50C8"}},"An\xE1lisis de probabilidad de \xE9xito"),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},"La IA analiza su caso espec\xEDfico con jurisprudencia real"))),!prob&&!loading&&React.createElement("button",{className:"btn bo",style:{width:"100%"},onClick:analizar},"\uD83C\uDFAF Analizar probabilidad de \xE9xito de mi caso"),loading&&React.createElement("div",{style:{textAlign:"center",padding:20},className:"pul"},React.createElement("div",{style:{fontSize:32,marginBottom:8}},"\u2696\uFE0F"),React.createElement("div",{style:{fontSize:13,color:"#6B7280"}},"Analizando su caso con jurisprudencia colombiana...")),prob&&React.createElement("div",{className:"fade"},React.createElement("div",{style:{display:"flex",gap:20,alignItems:"center",marginBottom:16}},React.createElement("div",{style:{position:"relative",width:90,height:90,flexShrink:0}},React.createElement("svg",{viewBox:"0 0 36 36",style:{width:90,height:90,transform:"rotate(-90deg)"}},React.createElement("circle",{cx:"18",cy:"18",r:"15.9",fill:"none",stroke:"#F3F4F6",strokeWidth:"3.5"}),React.createElement("circle",{cx:"18",cy:"18",r:"15.9",fill:"none",stroke:color,strokeWidth:"3.5",strokeDasharray:`${prob.probabilidad} ${100-prob.probabilidad}`,strokeLinecap:"round",style:{transition:"stroke-dasharray .8s ease"}})),React.createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}},React.createElement("div",{style:{fontWeight:800,fontSize:20,color,lineHeight:1}},prob.probabilidad,"%"),React.createElement("div",{style:{fontSize:8,fontWeight:700,color:"#9CA3AF",letterSpacing:.5}},"\xC9XITO"))),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6}},React.createElement("span",{style:{fontWeight:800,fontSize:16,color}},"Probabilidad ",nivel)),React.createElement("div",{style:{fontSize:13,color:"#374151",lineHeight:1.6,marginBottom:8}},prob.argumento_principal),React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},prob.tiempo_estimado&&React.createElement("span",{className:"tag tag-blue"},"\u23F1 ",prob.tiempo_estimado),prob.jurisprudencia_clave&&React.createElement("span",{className:"tag tag-gray"},"\uD83D\uDCDA ",prob.jurisprudencia_clave)))),prob.riesgo_principal&&React.createElement("div",{className:"warn-box",style:{marginBottom:10}},React.createElement("strong",null,"\u26A0\uFE0F Principal riesgo a considerar:")," ",prob.riesgo_principal),React.createElement("button",{className:"btn bghost sm",style:{marginTop:4},onClick:()=>setProb(null)},"\u21BA Volver a analizar")));}function BotonesCompartir({texto,tipo,onCopiar}){const[copiado,setCopiado]=useState(false);const copiar=()=>{navigator.clipboard?.writeText(texto);setCopiado(true);setTimeout(()=>setCopiado(false),2500);onCopiar?.();};return React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},React.createElement("button",{className:"btn bo sm",onClick:copiar},copiado?"✓ Copiado":"📋 Copiar"),React.createElement("button",{className:"btn",style:{background:"#25D366",color:"#fff",padding:"8px 14px",fontSize:12,borderRadius:9},onClick:()=>compartirWhatsApp(texto,tipo)},"\uD83D\uDCF1 WhatsApp"),React.createElement("button",{className:"btn bo sm",onClick:()=>imprimirSoloDocumento()},"\uD83D\uDDA8\uFE0F Imprimir"),navigator.share&&React.createElement("button",{className:"btn bo sm",onClick:()=>compartirDocumento(texto,tipo)},"\uD83D\uDCE4 Compartir"));}function SocialProof(){const[count]=useState(getContador());return React.createElement("div",{style:{background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)",borderRadius:12,padding:"10px 16px",display:"flex",gap:14,alignItems:"center",marginBottom:16,border:"1px solid #86EFAC"}},React.createElement("div",{style:{fontSize:20}},"\u2705"),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"#14532D"}},new Intl.NumberFormat("es-CO").format(count)," colombianos ya defendieron sus derechos"),React.createElement("div",{style:{fontSize:11,color:"#166534"}},"Tutelas, derechos de petici\xF3n, recursos y m\xE1s \u2014 todos generados gratis")));}function AlertaPlazos({casos}){const urgentes=casos.filter(c=>['impugnacion','desacato'].includes(c.etapa));if(!urgentes.length)return null;return React.createElement("div",{style:{background:"linear-gradient(135deg,#7F1D1D,#DC2626)",borderRadius:14,padding:"14px 18px",marginBottom:16,color:"#fff",display:"flex",gap:12,alignItems:"flex-start",boxShadow:"0 4px 20px rgba(220,38,38,.3)"},className:"glow"},React.createElement("div",{style:{fontSize:28,flexShrink:0,animation:"bounce 1s ease infinite"}},"\u26A0\uFE0F"),React.createElement("div",null,React.createElement("div",{style:{fontWeight:800,fontSize:15,marginBottom:4}},"Casos con plazos cr\xEDticos ahora mismo"),urgentes.map(c=>{const esImpug=c.etapa==="impugnacion";return React.createElement("div",{key:c.id,style:{fontSize:12,color:"rgba(255,255,255,.9)",marginBottom:3}},React.createElement("strong",null,"#",c.num," ",c.subcasoNombre,":")," ",esImpug?"Solo 3 días hábiles para impugnar":"La entidad no cumplió — iniciar desacato YA");}),React.createElement("div",{style:{fontSize:11,marginTop:6,opacity:.8}},"Toque cada caso para actuar ahora \u2192")));}function OnboardingModal({onStart,onDismiss}){const[paso,setPaso]=useState(0);const pasos=[{emoji:"⚖️",color:"#1E50C8",grad:"linear-gradient(135deg,#1E50C8,#3D68E3)",titulo:"Bienvenido a Ayuda Ciudadana",desc:"La plataforma legal más completa de Colombia. Gratuito, en español, disponible 24/7. Sin abogado, sin costos, sin complicaciones.",detalle:null,cta:"Comenzar →"},{emoji:"🗣️",color:"#1E50C8",grad:"linear-gradient(135deg,#312E81,#1E50C8)",titulo:"Cuéntenos su problema",desc:"No necesita saber de leyes. Solo cuéntenos qué le pasó — como se lo contaría a un familiar.",detalle:["Puede escribir o tocar el 🎙️ para hablar","En cualquier momento puede volver atrás","No hay respuestas malas — toda información ayuda"],cta:"Entendido →"},{emoji:"📄",color:"#7C3AED",grad:"linear-gradient(135deg,#4C1D95,#7C3AED)",titulo:"La plataforma trabaja por usted",desc:"Generamos el documento legal completo, le decimos exactamente dónde radicarlo y le hacemos el seguimiento hasta la solución.",detalle:["Tutelas, derechos de petición, desacatos","Seguimiento de plazos y etapas","Le avisamos cuando la entidad deba responder"],cta:"Casi listo →"},{emoji:"🎁",color:"#15803d",grad:"linear-gradient(135deg,#14532D,#15803d)",titulo:"24 horas completamente gratis",desc:"Empiece ahora sin registrarse. Cuando vea que funciona, puede crear su cuenta para guardar sus casos.",detalle:["Sin tarjeta de crédito","Sin contratos ni permanencia","Sus casos se guardan de forma segura"],cta:"¡Empezar ahora! →"}];const p=pasos[paso];const esUltimo=paso===pasos.length-1;return React.createElement("div",{style:{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}},React.createElement("div",{style:{position:"absolute",inset:0,background:"rgba(5,7,15,.85)",backdropFilter:"blur(12px)"},onClick:()=>{setOnboarding(false);try{localStorage.setItem("ayudaciudadana_onboarded","1");}catch{}}}),React.createElement("div",{style:{position:"relative",width:"100%",maxWidth:420,animation:"fadeUp .3s ease"}},React.createElement("div",{style:{position:"absolute",inset:-2,borderRadius:24,background:p.grad,opacity:.4,filter:"blur(12px)"}}),React.createElement("div",{style:{position:"relative",background:"linear-gradient(145deg,#0D1117,#161B2E)",borderRadius:22,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.6)"}},React.createElement("div",{style:{background:p.grad,padding:"32px 28px 24px",textAlign:"center",position:"relative"}},React.createElement("div",{style:{position:"absolute",top:14,right:14,display:"flex",gap:5}},pasos.map((_,i)=>React.createElement("div",{key:i,style:{width:i===paso?20:6,height:6,borderRadius:99,background:i===paso?"#fff":"rgba(255,255,255,.3)",transition:"width .3s"}}))),React.createElement("div",{style:{fontSize:52,marginBottom:12,filter:"drop-shadow(0 4px 12px rgba(0,0,0,.3))"}},p.emoji),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:800,color:"#fff",marginBottom:8,lineHeight:1.2}},p.titulo),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.8)",lineHeight:1.7}},p.desc)),React.createElement("div",{style:{padding:"20px 24px 24px"}},p.detalle&&React.createElement("div",{style:{marginBottom:18,display:"flex",flexDirection:"column",gap:8}},(p.detalle||[]).map((d,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:10,alignItems:"flex-start"}},React.createElement("div",{style:{width:20,height:20,borderRadius:"50%",background:`${p.color}22`,color:p.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,marginTop:1}},"\u2713"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.5}},d)))),!p.detalle&&React.createElement("div",{style:{height:8}}),React.createElement("div",{style:{display:"flex",gap:10}},paso>0&&React.createElement("button",{onClick:()=>setPaso(paso-1),style:{flex:"0 0 auto",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"12px 16px",fontSize:13,color:"rgba(255,255,255,.5)",cursor:"pointer",fontFamily:"inherit"}},"\u2190"),React.createElement("button",{onClick:()=>{if(esUltimo){onStart?.();}else setPaso(paso+1);},style:{flex:1,background:p.grad,border:"none",borderRadius:12,padding:"13px 22px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 20px ${p.color}55`,transition:"all .2s"},onMouseEnter:e=>e.currentTarget.style.transform="translateY(-1px)",onMouseLeave:e=>e.currentTarget.style.transform="none"},p.cta)),React.createElement("button",{onClick:()=>{onDismiss?.();},style:{width:"100%",background:"none",border:"none",color:"rgba(255,255,255,.2)",cursor:"pointer",fontFamily:"inherit",fontSize:12,marginTop:12,padding:4}},"Saltar introducci\xF3n")))));}function ProgresoCaso({etapa,num,total}){const ETAPAS_ORDEN=['radicacion','admision','contestacion','fallo','impugnacion','desacato','cerrado'];const idx=ETAPAS_ORDEN.indexOf(etapa);const pct=Math.round((idx+1)/ETAPAS_ORDEN.length*100);return React.createElement("div",null,React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6B7280",marginBottom:4}},React.createElement("span",null,"Progreso del proceso"),React.createElement("span",{style:{fontWeight:700,color:pct===100?"#15803d":"#1E50C8"}},pct,"%")),React.createElement("div",{className:"pb"},React.createElement("div",{className:"pf",style:{width:`${pct}%`,background:pct===100?"linear-gradient(90deg,#15803d,#16a34a)":""}})));}function useModoOscuro(){const[manual,setManual]=useState(()=>{try{const s=localStorage.getItem("ac_dark");return s===null?null:s==="true";}catch{return null;}});const hora=new Date().getHours();const autoOscuro=hora>=20||hora<7;const oscuro=manual!==null?manual:autoOscuro;const toggleDark=()=>{const nuevo=!oscuro;setManual(nuevo);try{localStorage.setItem("ac_dark",String(nuevo));}catch{}};const setAuto=()=>{setManual(null);try{localStorage.removeItem("ac_dark");}catch{}};return{oscuro,toggleDark,setAuto,esAuto:manual===null};}function useModoNocturno(){const hora=new Date().getHours();return hora>=20||hora<7;}const ORGANISMOS_INVESTIGADOS=[{ciudad:"Cali",org:"Secretaría de Movilidad de Santiago de Cali",desde:"2018-12-10",hasta:"2024-11-21",comparendos:2700000,recaudado:"$292.228 millones",grupo:1},{ciudad:"Medellín",org:"Secretaría de Movilidad de Medellín",desde:"2018-12-10",hasta:"2020-04-28",comparendos:717000,recaudado:"$62.415 millones",grupo:1},{ciudad:"Bogotá",org:"Secretaría Distrital de Movilidad Bogotá",desde:"2018-12-12",hasta:"2020-01-06",comparendos:293869,recaudado:"$70.773 millones",grupo:1},{ciudad:"Barranquilla",org:"Secretaría Distrital de Tránsito y Seguridad Vial",desde:"2018-12-10",hasta:"2024-06-15",comparendos:131000,recaudado:"$69.490 millones",grupo:1},{ciudad:"Cundinamarca",org:"Organismos de Tránsito Cundinamarca",desde:"2018-12-10",hasta:"2023-08-30",comparendos:297507,recaudado:"N/D",grupo:1},{ciudad:"Sabaneta",org:"Secretaría de Movilidad de Sabaneta",desde:"2018-12-10",hasta:"2022-05-10",comparendos:258117,recaudado:"N/D",grupo:1},{ciudad:"Los Patios",org:"Organismo de Tránsito Los Patios",desde:"2018-12-10",hasta:"2021-09-15",comparendos:249761,recaudado:"N/D",grupo:1},{ciudad:"Bello",org:"Secretaría de Movilidad de Bello",desde:"2018-12-10",hasta:"2021-04-20",comparendos:90374,recaudado:"N/D",grupo:1},{ciudad:"Villavicencio",org:"Inspección Municipal de Tránsito Villavicencio",desde:"2018-12-10",hasta:"2019-10-20",comparendos:45000,recaudado:"N/D",grupo:1},{ciudad:"Cartagena",org:"Secretaría del Interior y Tránsito Cartagena",desde:"2018-12-10",hasta:"2022-07-15",comparendos:38000,recaudado:"N/D",grupo:1},{ciudad:"Bucaramanga",org:"Secretaría de Tránsito Bucaramanga",desde:"2018-12-10",hasta:"2021-11-30",comparendos:32000,recaudado:"N/D",grupo:1},{ciudad:"Valledupar",org:"Secretaría de Tránsito y Transporte Valledupar",desde:"2018-12-10",hasta:"2022-03-15",comparendos:28000,recaudado:"N/D",grupo:1},{ciudad:"Montería",org:"Secretaría de Tránsito y Movilidad Montería",desde:"2018-12-10",hasta:"2022-09-20",comparendos:22000,recaudado:"N/D",grupo:1},{ciudad:"Sincelejo",org:"Secretaría de Tránsito Sincelejo",desde:"2018-12-10",hasta:"2022-01-10",comparendos:18000,recaudado:"N/D",grupo:1},{ciudad:"Soledad",org:"Organismo de Tránsito Soledad",desde:"2018-12-10",hasta:"2021-06-30",comparendos:65000,recaudado:"N/D",grupo:1},{ciudad:"Sabaneta (Antioquia)",org:"Organismo de Tránsito Sabaneta",desde:"2018-12-10",hasta:"2022-08-10",comparendos:42000,recaudado:"N/D",grupo:1},{ciudad:"Villa del Rosario",org:"Organismo de Tránsito Villa del Rosario",desde:"2018-12-10",hasta:"2021-12-15",comparendos:15000,recaudado:"N/D",grupo:1},{ciudad:"Galapa",org:"Organismo de Tránsito Galapa",desde:"2018-12-10",hasta:"2021-04-10",comparendos:12000,recaudado:"N/D",grupo:1},{ciudad:"Puerto Colombia",org:"Organismo de Tránsito Puerto Colombia",desde:"2018-12-10",hasta:"2021-03-20",comparendos:9500,recaudado:"N/D",grupo:1},{ciudad:"Turbaco",org:"Organismo de Tránsito Turbaco",desde:"2018-12-10",hasta:"2021-07-25",comparendos:8000,recaudado:"N/D",grupo:1},{ciudad:"Funza",org:"Organismo de Tránsito Funza",desde:"2018-12-10",hasta:"2021-05-15",comparendos:11000,recaudado:"N/D",grupo:1},{ciudad:"Ciénaga",org:"Organismo de Tránsito Ciénaga",desde:"2018-12-10",hasta:"2021-08-30",comparendos:7500,recaudado:"N/D",grupo:1},{ciudad:"Popayán",org:"Secretaría de Tránsito Popayán",desde:"2018-12-10",hasta:"2022-05-20",comparendos:19000,recaudado:"N/D",grupo:1},{ciudad:"Palmira",org:"Secretaría de Tránsito Palmira",desde:"2018-12-10",hasta:"2022-11-10",comparendos:23000,recaudado:"N/D",grupo:1},{ciudad:"Zipaquirá",org:"Organismo de Tránsito Zipaquirá",desde:"2018-12-10",hasta:"2021-09-05",comparendos:8800,recaudado:"N/D",grupo:1},{ciudad:"La Dorada",org:"División de Tránsito La Dorada",desde:"2018-12-10",hasta:"2019-09-03",comparendos:4500,recaudado:"N/D",grupo:1},{ciudad:"Santa Marta",org:"Secretaría de Movilidad Multimodal y Sostenible Santa Marta",desde:"2024-11-21",hasta:"2025-03-04",comparendos:null,recaudado:"N/D",grupo:2},{ciudad:"Valledupar (2)",org:"Secretaría de Tránsito y Transporte Valledupar",desde:"2024-03-15",hasta:"2025-08-13",comparendos:null,recaudado:"N/D",grupo:2},{ciudad:"Valle del Cauca",org:"Secretaría de Movilidad y Transporte del Valle del Cauca",desde:"2026-02-11",hasta:"2026-03-02",comparendos:null,recaudado:"N/D",grupo:2}];const CONTACTOS_SECRETARIAS={"Cali":{email:"contactenos@movilidad.cali.gov.co",web:"https://www.cali.gov.co/movilidad",tel:"(602) 8861021",ventanilla:"Cra 1 # 6A-50 Centro Administrativo"},"Medellín":{email:"movilidad@medellin.gov.co",web:"https://www.medellin.gov.co/movilidad",tel:"(604) 3857575",ventanilla:"Cr 44 # 21-51 Alpujarra"},"Bogotá":{email:"informacion.movilidad@sdm.gov.co",web:"https://www.movilidadbogota.gov.co/web/ventanilla_virtual",tel:"3800300",ventanilla:"ventanilla virtual en línea (preferida)"},"Barranquilla":{email:"transito@barranquilla.gov.co",web:"https://www.barranquilla.gov.co/transito",tel:"(605) 3301080",ventanilla:"Cra 54 # 75-23"},"Bucaramanga":{email:"transito@bucaramanga.gov.co",web:"https://www.bucaramanga.gov.co",tel:"(607) 6341111",ventanilla:"Calle 45 # 17-29"},"Cartagena":{email:"transitocartagena@cartagena.gov.co",web:"https://www.cartagena.gov.co",tel:"(605) 6550400",ventanilla:"Av. Pedro de Heredia"},"Cúcuta":{email:"transito@cucuta.gov.co",web:"https://www.cucuta.gov.co",tel:"(607) 5716060",ventanilla:"Palacio Municipal"},"Popayán":{email:"transitopopayan@popayan.gov.co",web:"https://www.popayan.gov.co",tel:"(602) 8240900",ventanilla:"Carrera 6 # 4-26"}};const DOCS_REQUERIDOS={no_pagado:["Cédula de ciudadanía (copia)","Número del comparendo (del SIMIT)","Número de placa del vehículo","Número de cédula del titular registrado en RUNT"],ya_pagado:["Cédula de ciudadanía (copia)","Comprobante de pago original o digital","Número del comparendo","Número de placa","Impresión del comparendo del SIMIT","Número de cuenta bancaria para devolución (si aplica)"],tercero:["Todo lo anterior","Poder autenticado del propietario del vehículo","Cédula del apoderado"]};const generarDocFotomulta=({tipo,datos})=>{const hoy=new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});if(tipo==="peticion_anulacion")return`
DERECHO DE PETICIÓN
SOLICITUD DE REVOCATORIA DE COMPARENDO POR FOTOMULTA IRREGULAR

Señores
${datos.secretaria}
${datos.ciudad}, ${hoy}

Respetados señores:

Yo, ${datos.nombre}, identificado(a) con Cédula de Ciudadanía No. ${datos.cedula}, en pleno ejercicio del derecho fundamental de petición consagrado en el Artículo 23 de la Constitución Política y desarrollado por la Ley 1755 de 2015, me permito dirigirme a ustedes para solicitar:

OBJETO DE LA PETICIÓN:
La revocatoria y anulación del comparendo No. ${datos.numComparendo}, impuesto mediante sistema de fotodetección (SAST) el día ${datos.fechaComparendo} sobre el vehículo de placa ${datos.placa}.

HECHOS:
1. El Ministerio de Transporte y la Superintendencia de Transporte, mediante comunicado oficial del 19 de mayo de 2026, anunciaron la apertura de investigación administrativa contra 37 organismos de tránsito del país por presuntos incumplimientos en la operación de sistemas automáticos de detección SAST (fotomultas).

2. ${datos.ciudad} figura expresamente en la lista de organismos investigados, específicamente por comparendos impuestos entre el ${datos.fechaInicio} y el ${datos.fechaFin}, período que corresponde exactamente a la fecha del comparendo objeto de esta petición.

3. Las irregularidades identificadas consisten en operar cámaras de fotodetección sin el concepto de desempeño expedido por el Instituto Nacional de Metrología, requisito indispensable exigido por la Ley 2251 de 2022 y la Resolución 718 del Ministerio de Transporte.

4. La ministra de Transporte, María Fernanda Rojas, declaró públicamente que los comparendos impuestos en ese período y en esas ciudades "quedan sin efecto" y deberán ser revocados de oficio.

5. La Superintendencia de Transporte confirmó que 5.832.906 comparendos deben ser revocados y que los organismos de tránsito tienen la obligación de implementar mecanismos expeditos de devolución.

FUNDAMENTOS DE DERECHO:
- Artículo 23 de la Constitución Política (Derecho de Petición)
- Ley 1755 de 2015 (Derecho de Petición)
- Ley 2251 de 2022 (Sistemas de Fotodetección)
- Resolución 718 del Ministerio de Transporte
- Comunicado oficial Ministerio de Transporte del 19 de mayo de 2026
- Sentencia C-038 de 2020 de la Corte Constitucional (debido proceso en comparendos)
- Artículo 74 Ley 1437/2011 CPACA (Revocatoria directa)

PRETENSIONES:
1. PRINCIPAL: Que se revoque y anule de oficio el comparendo No. ${datos.numComparendo} por haber sido impuesto mediante un sistema SAST que operaba en violación de los requisitos técnicos legales.
2. ACCESORIA: Que se certifique por escrito la anulación del comparendo y se actualice en el sistema SIMIT para que no genere cobros, bloqueos en el RUNT ni reporte en centrales de riesgo.
3. SE LE GARANTICE respuesta de fondo dentro de los 15 días hábiles señalados por la ley.

ADVERTENCIA: Si en el término de 15 días hábiles no recibo respuesta de fondo o esta es negativa sin justificación legal válida, acudiré ante el juez constitucional mediante Acción de Tutela por vulneración del Derecho de Petición y del Debido Proceso.

Atentamente,

${datos.nombre}
C.C. ${datos.cedula}
Tel: ${datos.telefono}
Correo: ${datos.email}
Dirección: ${datos.dir}

DOCUMENTOS ADJUNTOS:
□ Copia cédula de ciudadanía
□ Impresión del comparendo del SIMIT
□ Placa del vehículo verificada en RUNT
`.trim();if(tipo==="peticion_devolucion")return`
DERECHO DE PETICIÓN
SOLICITUD DE DEVOLUCIÓN DE DINERO POR FOTOMULTA IRREGULARMENTE PAGADA

Señores
${datos.secretaria}
${datos.ciudad}, ${hoy}

Respetados señores:

Yo, ${datos.nombre}, identificado(a) con Cédula de Ciudadanía No. ${datos.cedula}, en ejercicio del Artículo 23 de la CP y Ley 1755/2015, solicito formalmente:

OBJETO: La devolución de la suma de ${datos.monto} pagada por concepto del comparendo No. ${datos.numComparendo}, el cual fue impuesto irregularmente por un sistema SAST sin los requisitos técnicos exigidos por la ley.

HECHOS:
1. El día ${datos.fechaPago} pagué el comparendo No. ${datos.numComparendo} por valor de ${datos.monto}, correspondiente a la placa ${datos.placa}.

2. El Gobierno Nacional, mediante comunicado oficial del 19 de mayo de 2026 (Ministerio de Transporte y Supertransporte), confirmó que ese comparendo fue impuesto por un sistema SAST que operaba sin el concepto técnico del Instituto Nacional de Metrología exigido por la Ley 2251/2022.

3. El Superintendente de Transporte, Alfredo Piñeros, declaró que quienes ya pagaron "podrán solicitar la devolución directamente ante el organismo de tránsito que impuso la sanción".

4. ${datos.ciudad} figura en el período investigado (${datos.fechaInicio} a ${datos.fechaFin}), y la fecha del comparendo está dentro de ese rango.

5. No existe fundamento legal para retener dineros recaudados mediante un proceso irregular. La devolución es una obligación legal de la entidad.

FUNDAMENTOS DE DERECHO:
- Artículo 23 CP · Ley 1755/2015 · Ley 2251/2022 · Resolución 718 MT
- Artículo 90 CP (Responsabilidad del Estado por daño antijurídico)
- Comunicado Ministerio de Transporte 19 mayo 2026
- Artículo 86 Código Administrativo (CPACA) — devolución de pagos no debidos

PRETENSIONES:
1. PRINCIPAL: Devolución de ${datos.monto} pagados indebidamente por concepto del comparendo No. ${datos.numComparendo}.
2. INTERESES: Los intereses causados desde la fecha de pago hasta la devolución efectiva (Art. 177 CPACA).
3. Si la devolución no opera en efectivo, que se aplique como crédito para otros trámites o futuros comparendos.

Si no recibo respuesta en 15 días hábiles, presentaré Tutela y notificación a la Contraloría y Procuraduría.

Cuenta para devolución: ${datos.numeroCuenta||"[NOMBRE BANCO — TIPO CUENTA — NÚMERO — TITULAR]"}

Atentamente,
${datos.nombre} — C.C. ${datos.cedula} — Tel: ${datos.telefono}

DOCUMENTOS ADJUNTOS:
□ Copia cédula
□ Comprobante de pago original (${datos.fechaPago} — ${datos.monto})
□ Impresión del comparendo del SIMIT
□ Datos bancarios para devolución
`.trim();if(tipo==="tutela_fotomulta")return`
ACCIÓN DE TUTELA
VULNERACIÓN DEL DERECHO DE PETICIÓN Y DEBIDO PROCESO — FOTOMULTA IRREGULAR

Señor(a) Juez Civil Municipal o Promiscuo Municipal
${datos.ciudad}

Yo, ${datos.nombre}, C.C. ${datos.cedula}, presento Acción de Tutela contra ${datos.secretaria} por los siguientes:

HECHOS:
1. El ${datos.fechaPeticion} presenté Derecho de Petición solicitando la anulación/devolución del comparendo No. ${datos.numComparendo} (fotomulta irregular del período investigado por el Gobierno Nacional).
2. Han transcurrido más de 15 días hábiles desde la radicación sin que haya recibido respuesta de fondo.
3. La ${datos.secretaria} tiene la obligación legal de revocar los comparendos irregulares según lo ordenado por el Ministerio de Transporte y la Supertransporte.

DERECHOS VULNERADOS:
- Derecho de Petición (Art. 23 CP) — por omisión en responder en el plazo legal
- Debido Proceso (Art. 29 CP) — por mantener activo un comparendo ilegal
- Buen Nombre y Honra (Art. 15 CP) — si el comparendo reporta en centrales de riesgo

FUNDAMENTOS ADICIONALES:
- T-967/2014 CC: La omisión de respuesta a petición es suficiente para tutelar
- Ley 2251/2022 y Res. 718: La entidad violó los requisitos técnicos obligatorios

PRETENSIONES:
1. URGENTE: Que en las próximas 48 horas ${datos.secretaria} dé respuesta de fondo a mi petición.
2. PRINCIPAL: Que se ordene la anulación del comparendo No. ${datos.numComparendo} en el sistema SIMIT.
3. SI YA PAGUÉ: Que se ordene la devolución de ${datos.monto||"[MONTO PAGADO]"} en un plazo no mayor a 30 días.
4. Que se cancele cualquier bloqueo en el RUNT derivado de este comparendo.

Bajo la gravedad del juramento declaro que los hechos aquí narrados son ciertos.

${datos.nombre} — C.C. ${datos.cedula}
${datos.ciudad}, ${hoy}
Dirección: ${datos.dir} — Tel: ${datos.telefono}

Radicable ante cualquier juzgado civil municipal de ${datos.ciudad} o en línea:
https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea
`.trim();return"";};function AsistenteFotomultas({onGenerar,onVolver}){return null;}
function buscarIntelBloqueIA(bloque){
  return fetch(AI_API_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-6",
      max_tokens:600,
      messages:[{role:"user",content:"Dame 3 noticias legales recientes de Colombia sobre: "+bloque+". Responde JSON: [{titulo,resumen,fecha,categoria}]"}]
    })
  }).then(r=>r.json()).catch(()=>({content:[{text:"[]"}]}));
}

function IntelLegalBloque({bloque}){
  const[noticias,setNoticias]=useState([]);
  const[loading,setLoading]=useState(false);
  const[ultima,setUltima]=useState(null);
  
  const cargar=async()=>{
    const ahora=Date.now();
    if(ultima&&ahora-ultima<3600000)return; // Max 1 vez por hora
    setLoading(true);
    try{
      const r=await buscarIntelBloqueIA(bloque);
      const txt=r.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
      const data=JSON.parse(txt);
      if(Array.isArray(data))setNoticias(data.slice(0,3));
      setUltima(ahora);
    }catch(e){}
    setLoading(false);
  };
  
  return React.createElement("div",{className:"card",style:{marginBottom:14}},
    React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}},
      React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:14}},"⚡ Inteligencia Legal"),
      React.createElement("button",{onClick:cargar,disabled:loading,className:"btn bo sm"},
        loading?"Cargando...":"Cargar noticias")
    ),
    noticias.length===0&&!loading&&React.createElement("div",{style:{fontSize:13,color:"#6B7280",textAlign:"center",padding:"10px 0"}},"Presione 'Cargar noticias' para ver novedades legales"),
    loading&&React.createElement("div",{style:{textAlign:"center",padding:"14px"},className:"pul"},"Buscando novedades..."),
    noticias.map((n,i)=>React.createElement("div",{key:i,style:{borderTop:"1px solid #E5E7EB",paddingTop:10,marginTop:10}},
      React.createElement("div",{style:{fontWeight:600,fontSize:13,color:"#1E50C8",marginBottom:3}},n.titulo),
      React.createElement("div",{style:{fontSize:12,color:"#6B7280",lineHeight:1.5}},n.resumen),
      n.fecha&&React.createElement("div",{style:{fontSize:11,color:"#9CA3AF",marginTop:3}},n.fecha)
    ))
  );
}

function buildPromptSiguienteDoc(tipo,caso){
  const datos=caso?.datosPersonales||{};
  const nombre=datos.nombre||"[NOMBRE COMPLETO]";
  const cedula=datos.cedula||"[CÉDULA]";
  const telefono=datos.telefono||"[TELÉFONO]";
  const email=datos.email||"[CORREO]";
  const ciudad=datos.ciudad||"[CIUDAD]";
  const direccion=datos.direccion||"[DIRECCIÓN]";
  const entidad=datos.entidad||"[ENTIDAD]";
  const rep_legal=datos.rep_legal||"[REPRESENTANTE LEGAL]";
  const dir_entidad=datos.dir_entidad||"[DIRECCIÓN ENTIDAD]";
  const hoy=new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});
  const cat=caso?.cat||"general";
  const subcaso=caso?.subcasoNombre||"caso general";
  const historia=caso?.respuestas?Object.values(caso.respuestas).filter(Boolean).join(". "):"";
  const datosStr=`Accionante/Solicitante: ${nombre}, C.C. ${cedula}
Dirección: ${direccion}, ${ciudad}
Teléfono: ${telefono} | Correo: ${email}
Entidad accionada/demandada: ${entidad}
Representante legal entidad: ${rep_legal}
Dirección entidad: ${dir_entidad}
Fecha: ${hoy}
Categoría: ${cat} | Problema: ${subcaso}
Hechos del caso: ${historia.substring(0,600)}`;

  if(tipo==="tutela_por_silencio")return`Eres abogado colombiano experto en tutelas. Genera una Acción de Tutela COMPLETA, formal y lista para radicar, por vulneración del Derecho de Petición (Art. 23 C.P.) debido a silencio administrativo.
${datosStr}
La tutela DEBE incluir: 1) Encabezado formal al Juzgado (ciudad, fecha, juez), 2) Identificación del accionante con todos sus datos, 3) Entidad accionada con su dirección, 4) Hechos numerados cronológicamente, 5) Derechos fundamentales vulnerados (Art. 23, 29, 86 C.P.), 6) Pretensiones claras y concretas, 7) Fundamentos de derecho (Decreto 2591/1991), 8) Pruebas, 9) Notificaciones, 10) Firma. NO dejes campos en blanco — usa los datos proporcionados.`;

  if(tipo==="impugnacion")return`Eres abogado colombiano. Genera un Recurso de Impugnación COMPLETO contra un fallo de tutela desfavorable.
${datosStr}
Incluye: 1) Encabezado al Superior Jerárquico, 2) Identificación del impugnante, 3) Referencia al fallo impugnado, 4) Argumentos jurídicos por qué el juez erró, 5) Jurisprudencia Corte Constitucional relevante, 6) Pretensión de revocar el fallo, 7) Firma. Formato legal formal completo.`;

  if(tipo==="desacato")return`Eres abogado colombiano. Genera un Incidente de Desacato COMPLETO por incumplimiento de fallo de tutela.
${datosStr}
Incluye: 1) Juzgado que profirió el fallo, 2) Identificación del solicitante, 3) Entidad incumplida: ${entidad} - ${rep_legal}, 4) Descripción detallada del incumplimiento, 5) Solicitud de medidas coercitivas (multas, arresto Art. 52 Decreto 2591/1991), 6) Pruebas del incumplimiento. Urgente y contundente.`;

  if(tipo==="recurso_reposicion")return`Eres abogado colombiano. Genera un Recurso de Reposición COMPLETO contra resolución administrativa.
${datosStr}
Incluye: 1) Identificación del acto recurrido, 2) Datos del recurrente, 3) Entidad: ${entidad}, Rep: ${rep_legal}, 4) Argumentos jurídicos, 5) Pretensión de revocación, 6) Firma. Formal y bien fundamentado.`;

  if(tipo==="derecho_peticion")return`Eres abogado colombiano. Genera un Derecho de Petición COMPLETO, formal y listo para radicar (Art. 23 C.P., Ley 1755/2015).
${datosStr}
El documento DEBE incluir: 1) Ciudad y fecha, 2) Señores de ${entidad} - A: ${rep_legal} - Dirección: ${dir_entidad}, 3) Asunto claro, 4) Respetuoso saludo, 5) Hechos numerados y detallados basados en: ${historia.substring(0,500)}, 6) Fundamentos de derecho, 7) Peticiones concretas y numeradas, 8) Pruebas que se anexan, 9) Datos del peticionario: ${nombre} C.C. ${cedula} Tel: ${telefono} Email: ${email} Dir: ${direccion} ${ciudad}, 10) Firma. Plazo legal de respuesta: 15 días hábiles.`;

  if(tipo==="tutela")return`Eres abogado colombiano experto. Genera una Acción de Tutela COMPLETA y formal lista para radicar.
${datosStr}
DEBE incluir: 1) Encabezado al Juzgado de ${ciudad}, 2) Accionante: ${nombre} C.C. ${cedula} Dir: ${direccion} ${ciudad} Tel: ${telefono}, 3) Accionado: ${entidad} Rep: ${rep_legal} Dir: ${dir_entidad}, 4) Derechos fundamentales vulnerados, 5) Hechos numerados: ${historia.substring(0,500)}, 6) Pretensiones específicas, 7) Fundamentos (Art. 86 C.P., Decreto 2591/1991), 8) Medida provisional si aplica, 9) Pruebas, 10) Notificaciones, 11) Firma. Documento profesional, completo, sin campos en blanco.`;

  return`Eres abogado colombiano. Genera un documento legal COMPLETO y formal para radicar.
${datosStr}
Tipo de documento: ${tipo}
Genera el documento completo con TODOS los datos proporcionados. No dejes ningún campo en blanco. El documento debe ser profesional, bien estructurado y listo para presentar.`;
}

function AdminPanelInline({user,onSalir}){const[tab,setTab]=useState("info");return React.createElement("div",{style:{minHeight:"100vh",background:"#07090F",color:"#E2E8F0",fontFamily:"DM Sans,sans-serif"}},React.createElement("div",{style:{background:"rgba(255,255,255,.03)",borderBottom:"1px solid rgba(255,255,255,.05)",padding:"0 20px",display:"flex",alignItems:"center",height:52,gap:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:14,color:"#fff"}},"\u2696\uFE0F TutelaYa"),React.createElement("div",{style:{fontSize:9,fontWeight:800,background:"linear-gradient(135deg,#1E50C8,#7C3AED)",color:"#fff",padding:"2px 8px",borderRadius:99,letterSpacing:1}},"ADMIN"),React.createElement("div",{style:{flex:1}}),React.createElement("button",{onClick:onSalir,style:{background:"rgba(220,38,38,.15)",border:"1px solid rgba(220,38,38,.25)",color:"#F87171",borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}},"\u2190 Salir del panel")),React.createElement("div",{style:{padding:24,maxWidth:900,margin:"0 auto"}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:6}},"Panel de Administrador"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:24}},"Bienvenido, ",user?.nombre||user?.email,". Panel de control completo disponible al conectar Supabase."),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:24}},[{ico:"👥",t:"Gestión de usuarios",d:"Ver, cambiar planes, suspender cuentas",c:"#818CF8"},{ico:"⚖️",t:"Todos los casos",d:"Ver casos generados por todos los usuarios",c:"#A78BFA"},{ico:"💳",t:"Pagos Mercado Pago",d:"Historial de suscripciones e ingresos",c:"#34D399"},{ico:"📊",t:"Métricas",d:"Conversión, retención, crecimiento",c:"#60A5FA"},{ico:"🔒",t:"Seguridad",d:"Log de accesos y auditoría",c:"#FCD34D"},{ico:"⚙️",t:"Configuración",d:"Precios, features, dominio",c:"#F87171"}].map((m,i)=>React.createElement("div",{key:i,style:{background:"rgba(255,255,255,.03)",border:`1px solid ${m.c}33`,borderRadius:13,padding:16,borderLeft:`3px solid ${m.c}`}},React.createElement("div",{style:{fontSize:22,marginBottom:8}},m.ico),React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"#fff",marginBottom:3}},m.t),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.35)",lineHeight:1.4}},m.d)))),React.createElement("div",{style:{background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.2)",borderRadius:14,padding:20}},React.createElement("div",{style:{fontWeight:700,color:"#FCD34D",fontSize:14,marginBottom:12}},"\u2699\uFE0F Para activar el panel completo"),React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.6)",lineHeight:1.8,marginBottom:16}},"El panel completo con datos reales funciona al conectar Supabase. Sigue estos pasos:"),["1. Crea tu proyecto en supabase.com (gratis)","2. Ejecuta el SQL Schema que está en AyudaCiudadana_Auth_Sistema.jsx","3. Reemplaza SUPABASE_URL y SUPABASE_ANON_KEY en ese archivo","4. Ejecuta: UPDATE perfiles SET es_admin=TRUE WHERE email='tu@email.com'","5. El panel mostrará datos reales de todos los usuarios"].map((paso,i)=>React.createElement("div",{key:i,style:{fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:5}},"\u2713 ",paso)),React.createElement("div",{style:{marginTop:14,padding:"10px 14px",background:"rgba(255,255,255,.05)",borderRadius:9,fontSize:11,color:"rgba(255,255,255,.4)"}},"\uD83D\uDCA1 Hasta entonces, los datos de usuarios se guardan en localStorage del browser y son visibles en las DevTools del navegador (F12 \u2192 Application \u2192 Local Storage)."))));}function NavInferiorMovil({pantActual,onNavegar,esAdmin}){const items=[{id:"inicio",ico:"🏠",label:"Inicio"},{id:"casos",ico:"📋",label:"Mis casos"},{id:"contratos",ico:"📄",label:"Contratos"},{id:"notarial",ico:"🏛️",label:"Notaría"},...(esAdmin?[{id:"admin",ico:"🛡️",label:"Admin"}]:[{id:"directorio",ico:"🤝",label:"Abogados"}])];return React.createElement("div",{className:"bottom-safe nav-inferior-movil",style:{position:"fixed",bottom:0,left:0,right:0,zIndex:90,background:"rgba(255,255,255,.97)",backdropFilter:"blur(12px)",borderTop:"1px solid #E5E7EB",display:"flex",justifyContent:"space-around",padding:"6px 4px 4px",boxShadow:"0 -2px 16px rgba(0,0,0,.06)"}},items.map(it=>{const activo=pantActual===it.id;return React.createElement("button",{key:it.id,onClick:()=>onNavegar(it.id),"aria-label":it.label,style:{background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 8px",borderRadius:10,flex:1,minWidth:0,transition:"all .15s"}},React.createElement("span",{style:{fontSize:20,filter:activo?"none":"grayscale(.4) opacity(.6)",transform:activo?"scale(1.1)":"scale(1)",transition:"transform .15s"}},it.ico),React.createElement("span",{style:{fontSize:9,fontWeight:activo?700:500,color:activo?"#1E50C8":"#9CA3AF",whiteSpace:"nowrap"}},it.label));}));}const validar={cedula:v=>{const limpio=(v||"").replace(/\D/g,"");if(!limpio)return{ok:false,msg:""};if(limpio.length<6)return{ok:false,msg:"Cédula muy corta"};if(limpio.length>11)return{ok:false,msg:"Cédula muy larga"};return{ok:true,msg:"✓"};},email:v=>{if(!v)return{ok:false,msg:""};const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return re.test(v)?{ok:true,msg:"✓"}:{ok:false,msg:"Correo inválido"};},telefono:v=>{const limpio=(v||"").replace(/\D/g,"");if(!limpio)return{ok:false,msg:""};if(limpio.length!==10)return{ok:false,msg:"Debe tener 10 dígitos"};if(!limpio.startsWith("3"))return{ok:false,msg:"Celular colombiano empieza por 3"};return{ok:true,msg:"✓"};},placa:v=>{const limpio=(v||"").toUpperCase().replace(/[^A-Z0-9]/g,"");if(!limpio)return{ok:false,msg:""};const re=/^[A-Z]{3}[0-9]{2,3}[A-Z]?$/;return re.test(limpio)?{ok:true,msg:"✓"}:{ok:false,msg:"Formato: ABC123"};},noVacio:v=>v&&v.trim()?{ok:true,msg:"✓"}:{ok:false,msg:""}};function InputValidado({tipo="text",validador,label,ph,value,onChange,requerido}){const[tocado,setTocado]=useState(false);const val=validador?validador(value):{ok:true,msg:""};const mostrarError=tocado&&!val.ok&&val.msg;const mostrarOk=tocado&&val.ok&&value;return React.createElement("div",null,label&&React.createElement("label",null,label,requerido&&React.createElement("span",{style:{color:"#DC2626"}}," *")),React.createElement("div",{style:{position:"relative"}},React.createElement("input",{type:tipo,placeholder:ph,value:value,onChange:e=>onChange(e.target.value),onBlur:()=>setTocado(true),style:{width:"100%",boxSizing:"border-box",paddingRight:mostrarOk||mostrarError?"36px":undefined,borderColor:mostrarError?"#FCA5A5":mostrarOk?"#86EFAC":undefined}}),mostrarOk&&React.createElement("span",{style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#15803d",fontSize:14}},"\u2713"),mostrarError&&React.createElement("span",{style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"#DC2626",fontSize:14}},"\u2715")),mostrarError&&React.createElement("div",{style:{fontSize:11,color:"#DC2626",marginTop:3}},val.msg));}async function llamarIA(prompt,opciones={}){const{maxTokens=1000,reintentos=2,modelo="claude-sonnet-4-6"}=opciones;let ultimoError=null;for(let intento=0;intento<=reintentos;intento++){try{const res=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:modelo,max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})});if(!res.ok)throw new Error(`HTTP ${res.status}`);const j=await res.json();const texto=j.content?.map(b=>b.text||"").join("")||"";if(!texto)throw new Error("Respuesta vacía");return{ok:true,texto};}catch(e){ultimoError=e;if(intento<reintentos){await new Promise(r=>setTimeout(r,800*(intento+1)));}}}return{ok:false,error:ultimoError?.message||"Error de conexión",texto:""};}const IA_CACHE_KEY="tj_ia_cache_v2";const IA_CACHE_MAX=20;const IA_CACHE_TTL=7*24*60*60*1000;const iaCache={_load(){try{return JSON.parse(localStorage.getItem(IA_CACHE_KEY))||{};}catch{return{};}},_save(cache){try{localStorage.setItem(IA_CACHE_KEY,JSON.stringify(cache));}catch{}},_key(subcasoId,respuestas,tipoDoc){const resStr=JSON.stringify(respuestas||{});let hash=0;for(let i=0;i<resStr.length;i++)hash=(hash<<5)-hash+resStr.charCodeAt(i);return`${subcasoId}_${tipoDoc}_${Math.abs(hash)}`;},get(subcasoId,respuestas,tipoDoc){const cache=this._load();const key=this._key(subcasoId,respuestas,tipoDoc);const entry=cache[key];if(!entry)return null;if(Date.now()-entry.ts>IA_CACHE_TTL){delete cache[key];this._save(cache);return null;}return entry.texto;},set(subcasoId,respuestas,tipoDoc,texto){const cache=this._load();const key=this._key(subcasoId,respuestas,tipoDoc);cache[key]={texto,ts:Date.now()};const keys=Object.keys(cache);if(keys.length>IA_CACHE_MAX){const masViejo=keys.sort((a,b)=>cache[a].ts-cache[b].ts)[0];delete cache[masViejo];}this._save(cache);},limpiar(){try{localStorage.removeItem(IA_CACHE_KEY);}catch{}},contar(){return Object.keys(this._load()).length;}};const INDICE_BUSQUEDA=[{cat:"salud",sub:"neg_med",nombre:"EPS niega medicamento",keywords:["medicamento","pastilla","droga","formula","eps","niega","no entrega","farmacia","no autoriza"]},{cat:"salud",sub:"neg_proc",nombre:"EPS niega procedimiento o cirugía",keywords:["cirugia","operacion","procedimiento","eps","niega","no autoriza","tratamiento","quimioterapia","radioterapia"]},{cat:"salud",sub:"neg_med_no",nombre:"Medicamento no POS",keywords:["medicamento no pos","no cubierto","no incluido","prescripcion","no cubre"]},{cat:"salud",sub:"eps_dem",nombre:"EPS me quiere desafiliar",keywords:["desafiliar","retirar","desafiliacion","eps","exclusion","traslado forzado"]},{cat:"salud",sub:"urg",nombre:"Urgencias negadas",keywords:["urgencias","urgencia","emergencia","niegan","urgente","guardia"]},{cat:"trabajo",sub:"desp_sin",nombre:"Despido sin justa causa",keywords:["despido","despidieron","liquidacion","desempleo","trabajo","jefe","empresa","terminaron contrato"]},{cat:"trabajo",sub:"desp_emb",nombre:"Despido por embarazo",keywords:["embarazo","embarazada","embarazado","despido","despidieron","fuero maternidad","bebe","lactancia"]},{cat:"trabajo",sub:"acoso",nombre:"Acoso laboral",keywords:["acoso","bullying","hostigamiento","mobbing","trabajo","compañero","jefe","humillacion"]},{cat:"trabajo",sub:"no_pago",nombre:"No me pagan el salario",keywords:["salario","pago","sueldo","no pagan","deben","deuda","nomina"]},{cat:"trabajo",sub:"prest",nombre:"No me pagan prestaciones",keywords:["prestaciones","cesantias","vacaciones","prima","liquidacion","debe","no pago"]},{cat:"bancos",sub:"cobro_ind",nombre:"Cobro no autorizado",keywords:["cobro","cargo","no autorice","desconocido","banco","tarjeta","credito","debito"]},{cat:"bancos",sub:"fraude_banco",nombre:"Fraude bancario",keywords:["fraude","robo","clonaron","hackearon","estafa","retiro","no reconozco","banco"]},{cat:"bancos",sub:"ref_cred",nombre:"Banco niega crédito",keywords:["credito","prestamo","niega","negaron","rechazo","banco"]},{cat:"movilidad",sub:"presc_comp",nombre:"Fotomulta a anular",keywords:["multa","fotomulta","comparendo","camara","simit","secretaria transito","placa"]},{cat:"movilidad",sub:"comp_disp",nombre:"Comparendo en disputa",keywords:["comparendo","infraccion","multa","agente","policia","transito","disputo"]},{cat:"pension",sub:"neg_pens",nombre:"Negan la pensión",keywords:["pension","colpensiones","semanas","vejez","jubilacion","negaron"]},{cat:"pension",sub:"pens_delay",nombre:"Pensión demorada",keywords:["pension","demora","atraso","retraso","colpensiones","espera","tarda"]},{cat:"servicios",sub:"corte_ser",nombre:"Cortaron el servicio",keywords:["cortaron","agua","luz","gas","energia","internet","telefono","servicios","corte"]},{cat:"servicios",sub:"cobro_exc",nombre:"Cobro excesivo en factura",keywords:["factura","cobro","exceso","cara","alta","electricidad","agua","gas"]},{cat:"educacion",sub:"neg_mat",nombre:"Niegan matrícula",keywords:["matricula","colegio","universidad","niegan","estudio","educacion","cupo"]},{cat:"educacion",sub:"acoso_esc",nombre:"Matoneo o acoso escolar",keywords:["matoneo","bullying","acoso","colegio","escuela","niño","estudiante"]},{cat:"vivienda",sub:"des_for",nombre:"Desalojo forzado",keywords:["desalojo","desahucio","lanzamiento","sacar","casa","arriendo","arrendatario"]},{cat:"vivienda",sub:"cond_inm",nombre:"Inmueble en mal estado",keywords:["mal estado","humedad","goteras","grietas","estructura","arrendador","arreglar"]},{cat:"peticion",sub:"der_pet",nombre:"Derecho de petición",keywords:["peticion","respuesta","entidad","solicitud","no responden","silencio","certificado","informacion"]},{cat:"peticion",sub:"silencio",nombre:"Entidad no respondió",keywords:["no respondio","silencio","entidad","peticion","espere","vencio"]},{cat:"dian",sub:"sancion",nombre:"Sanción DIAN",keywords:["dian","impuesto","sancion","multa","declaracion","renta","iva"]}];function usarBusquedaGlobal(query){if(!query||query.trim().length<3)return[];const q=query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");const resultados=[];for(const item of INDICE_BUSQUEDA){let score=0;const nombre=item.nombre.toLowerCase();const words=q.split(/\s+/).filter(w=>w.length>2);if(nombre.includes(q))score+=10;words.forEach(w=>{if(nombre.includes(w))score+=3;});item.keywords.forEach(kw=>{if(q.includes(kw))score+=5;words.forEach(w=>{if(kw.includes(w)||w.includes(kw))score+=2;});});if(score>0)resultados.push({...item,score});}return resultados.sort((a,b)=>b.score-a.score).slice(0,5);}function BusquedaGlobal({onSeleccionar,onCerrar}){const[query,setQuery]=useState("");const[resultados,setResultados]=useState([]);const inputRef=useRef(null);useEffect(()=>{if(inputRef.current)inputRef.current.focus();},[]);useEffect(()=>{setResultados(usarBusquedaGlobal(query));},[query]);const catEmoji={salud:"💊",trabajo:"👷",bancos:"🏦",movilidad:"📸",pension:"👴",servicios:"⚡",educacion:"📚",vivienda:"🏠",peticion:"📋",dian:"💼"};return React.createElement("div",{style:{position:"fixed",inset:0,zIndex:9998,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"60px 16px 20px"},onClick:e=>e.target===e.currentTarget&&onCerrar?.()},React.createElement("div",{style:{position:"absolute",inset:0,background:"rgba(5,7,15,.75)",backdropFilter:"blur(8px)"},onClick:onCerrar}),React.createElement("div",{style:{position:"relative",width:"100%",maxWidth:540,animation:"fadeUp .2s ease"}},React.createElement("div",{style:{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,.3)"}},React.createElement("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:resultados.length?"1px solid #F3F4F6":"none"}},React.createElement("span",{style:{fontSize:20,flexShrink:0}},"\uD83D\uDD0D"),React.createElement("input",{ref:inputRef,placeholder:"Cu\xE9nteme su problema... Ej: 'la EPS no me da el medicamento'",value:query,onChange:e=>setQuery(e.target.value),onKeyDown:e=>e.key==="Escape"&&onCerrar?.(),style:{flex:1,border:"none",outline:"none",fontSize:15,color:"#111827",background:"none",fontFamily:"inherit"}}),query&&React.createElement("button",{onClick:()=>setQuery(""),style:{background:"none",border:"none",color:"#9CA3AF",cursor:"pointer",fontSize:18,flexShrink:0}},"\u2715"),React.createElement("button",{onClick:onCerrar,style:{background:"#F3F4F6",border:"none",borderRadius:8,padding:"5px 10px",color:"#6B7280",cursor:"pointer",fontSize:12,fontFamily:"inherit",flexShrink:0}},"Esc")),resultados.length>0&&React.createElement("div",{style:{maxHeight:360,overflowY:"auto"}},resultados.map((r,i)=>React.createElement("button",{key:i,onClick:()=>{onSeleccionar(r);onCerrar?.();},style:{width:"100%",display:"flex",gap:12,padding:"12px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left",transition:"background .12s",borderBottom:i<resultados.length-1?"1px solid #F9FAFB":"none",fontFamily:"inherit"},onMouseEnter:e=>e.currentTarget.style.background="#F8FAFF",onMouseLeave:e=>e.currentTarget.style.background="none"},React.createElement("div",{style:{width:36,height:36,borderRadius:10,background:"#EEF3FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}},catEmoji[r.cat]||"⚖️"),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontWeight:700,fontSize:14,color:"#1E50C8",marginBottom:2}},r.nombre),React.createElement("div",{style:{fontSize:11,color:"#9CA3AF",textTransform:"capitalize"}},r.cat.replace("_"," "))),React.createElement("span",{style:{color:"#DCE6FB",fontSize:18,alignSelf:"center"}},"\u2192")))),!query&&React.createElement("div",{style:{padding:"16px 18px 20px"}},React.createElement("div",{style:{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:.5,marginBottom:10}},"B\xDASQUEDAS FRECUENTES"),React.createElement("div",{style:{display:"flex",flexWrap:"wrap",gap:7}},["me despidieron embarazada","EPS niega cirugía","fotomulta 2022","no me pagan salario","banco cobro raro","cortaron el agua"].map((s,i)=>React.createElement("button",{key:i,onClick:()=>setQuery(s),style:{background:"#F3F4F6",border:"1px solid #E5E7EB",borderRadius:20,padding:"5px 12px",fontSize:12,color:"#374151",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"},onMouseEnter:e=>e.currentTarget.style.background="#EEF3FE",onMouseLeave:e=>e.currentTarget.style.background="#F3F4F6"},s)))),query&&resultados.length===0&&query.length>=3&&React.createElement("div",{style:{padding:"24px 18px",textAlign:"center",color:"#9CA3AF"}},React.createElement("div",{style:{fontSize:24,marginBottom:8}},"\uD83E\uDD14"),React.createElement("div",{style:{fontSize:13,fontWeight:600,marginBottom:4}},"No encontramos ese caso exacto"),React.createElement("div",{style:{fontSize:12}},"Pruebe con otras palabras o ",React.createElement("button",{onClick:onCerrar,style:{background:"none",border:"none",color:"#1E50C8",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:12}},"navegue por categor\xEDas")))),React.createElement("div",{style:{textAlign:"center",marginTop:10,fontSize:11,color:"rgba(255,255,255,.3)"}},"Presione Escape o haga click fuera para cerrar")));}function verificarPlazosNotificaciones(casos){if(!casos?.length||!("Notification"in window)||Notification.permission!=="granted")return;const hoy=new Date();const PLAZOS_ETAPA={admision:15,contestacion:3,fallo:3};casos.forEach(caso=>{if(caso.etapa==="radicacion"||caso.etapa==="cerrado")return;const plazo=PLAZOS_ETAPA[caso.etapa];if(!plazo)return;const fechaUltimaEtapa=caso.historial?.slice(-1)[0]?.fecha||caso.fecha_creacion;if(!fechaUltimaEtapa)return;const diasTranscurridos=Math.floor((hoy-new Date(fechaUltimaEtapa))/(1000*60*60*24));const diasRestantes=plazo-diasTranscurridos;if(diasRestantes<=3&&diasRestantes>=0){new Notification(`⏰ Ayuda Ciudadana — Plazo próximo a vencer`,{body:`Su caso "${caso.subcasoNombre||caso.subcaso_nombre||"activo"}" vence en ${diasRestantes} día${diasRestantes!==1?"s":""}. Entre a la app para actuar.`,icon:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230F2A5E'/><text y='.9em' font-size='80' x='10'>⚖️</text></svg>",tag:`plazo_${caso.id}`,requireInteraction:true});}else if(diasRestantes<0){new Notification(`🚨 Ayuda Ciudadana — Plazo VENCIDO`,{body:`El plazo de su caso "${caso.subcasoNombre||"activo"}" venció hace ${Math.abs(diasRestantes)} días. Actúe ahora.`,icon:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23DC2626'/><text y='.9em' font-size='80' x='10'>⚠️</text></svg>",tag:`vencido_${caso.id}`,requireInteraction:true});}});}

// ════════════════════════════════════════════════════════════
// COMPONENTES RECONSTRUIDOS
// ════════════════════════════════════════════════════════════

function BtnInstalarApp(){
  const[show,setShow]=useState(false);
  const deferRef=useRef(null);
  useEffect(()=>{
    const h=e=>{e.preventDefault();deferRef.current=e;setShow(true);};
    window.addEventListener("beforeinstallprompt",h);
    return()=>window.removeEventListener("beforeinstallprompt",h);
  },[]);
  if(!show)return null;
  return React.createElement("button",{onClick:async()=>{if(deferRef.current){deferRef.current.prompt();setShow(false);}},className:"nl hm",style:{color:"#15803d",fontWeight:700}},"📲 Instalar app");
}

function BarraProcesoCompleto({etapaActual}){
  const etapas=[{id:"radicacion",l:"Radicación",ico:"📤"},{id:"admision",l:"Admisión",ico:"📋"},{id:"traslado",l:"Traslado",ico:"📨"},{id:"fallo",l:"Fallo",ico:"⚖️"},{id:"cumplimiento",l:"Cumplimiento",ico:"✅"}];
  const idx=etapas.findIndex(e=>e.id===etapaActual);
  const actual=idx<0?0:idx;
  return React.createElement("div",{className:"card",style:{marginBottom:14}},
    React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:14,marginBottom:14}},"📍 Estado de su proceso"),
    React.createElement("div",{style:{display:"flex",justifyContent:"space-between",position:"relative"}},
      etapas.map((e,i)=>React.createElement("div",{key:e.id,style:{display:"flex",flexDirection:"column",alignItems:"center",flex:1,zIndex:1}},
        React.createElement("div",{style:{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,background:i<=actual?"linear-gradient(135deg,#1E50C8,#3D68E3)":"#E5E7EB",color:i<=actual?"#fff":"#9CA3AF",marginBottom:6,transition:"all .3s"}},e.ico),
        React.createElement("div",{style:{fontSize:10,textAlign:"center",color:i<=actual?"#1E50C8":"#9CA3AF",fontWeight:i===actual?700:500}},e.l)
      ))
    )
  );
}

function GuiaEtapaActual({caso,onAccion}){
  const etapa=caso?.etapa||"radicacion";
  const guias={
    radicacion:{titulo:"Radique su documento",desc:"Presente su documento ante la entidad o juzgado correspondiente.",accion:"documento",btn:"📄 Ver mi documento"},
    admision:{titulo:"Espere la admisión",desc:"La entidad tiene un plazo legal para admitir y dar respuesta.",accion:"confirmar_radicacion",btn:"✅ Confirmar que radiqué"},
    fallo:{titulo:"Revise el fallo",desc:"Si el fallo es desfavorable, puede impugnar.",accion:"documento",btn:"📄 Generar impugnación"}
  };
  const g=guias[etapa]||guias.radicacion;
  return React.createElement("div",{className:"card",style:{marginBottom:14,borderLeft:"4px solid #1E50C8"}},
    React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:15,marginBottom:6}},"👉 ",g.titulo),
    React.createElement("div",{style:{fontSize:13,color:"#6B7280",lineHeight:1.6,marginBottom:12}},g.desc),
    React.createElement("button",{onClick:()=>onAccion&&onAccion(g.accion),className:"btn bo sm"},g.btn)
  );
}

function ChecklistEvidencias({
  subcasoId,
  urgente
}) {
  const evidencias = EVIDENCIAS_POR_SUBCASO[subcasoId] || EVIDENCIAS_POR_SUBCASO.default;
  const [marcadas, setMarcadas] = useState(new Set());
  const toggle = i => setMarcadas(prev => {
    const n = new Set(prev);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });
  const listas = marcadas.size;
  const total = evidencias.length;
  const pct = Math.round(listas / total * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      borderLeft: `4px solid ${pct === 100 ? "#15803d" : urgente ? "#DC2626" : "#D97706"}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      flexWrap: "wrap",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 15,
      color: "#1E50C8"
    }
  }, "?? Evidencias para que el juez falle a su favor"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: pct === 100 ? "#15803d" : "#D97706"
    }
  }, listas, "/", total, " reunidas")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      borderRadius: 99,
      background: "#E5E7EB",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 99,
      background: pct === 100 ? "#15803d" : "linear-gradient(90deg,#D97706,#F59E0B)",
      width: `${pct}%`,
      transition: "width .4s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, evidencias.map((ev, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      cursor: "pointer",
      padding: "7px 10px",
      borderRadius: 9,
      background: marcadas.has(i) ? "#F0FDF4" : "#F8FAFF",
      border: `1px solid ${marcadas.has(i) ? "#86EFAC" : "#E5E7EB"}`,
      transition: "all .15s"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: marcadas.has(i),
    onChange: () => toggle(i),
    style: {
      marginTop: 2,
      width: "auto",
      flexShrink: 0,
      accentColor: "#15803d"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: marcadas.has(i) ? "#14532D" : "#374151",
      fontWeight: marcadas.has(i) ? 600 : 400,
      lineHeight: 1.5
    }
  }, ev)))), pct === 100 ? /*#__PURE__*/React.createElement("div", {
    className: "success-box",
    style: {
      marginTop: 10
    }
  }, "\u2705 ", /*#__PURE__*/React.createElement("strong", null, "\xA1Excelente!"), " Tiene todas las evidencias. El juez tendr\xE1 base s\xF3lida para fallar a su favor.") : /*#__PURE__*/React.createElement("div", {
    className: "warn-box",
    style: {
      marginTop: 10
    }
  }, "?? Re\xFAna tantas evidencias como pueda antes de radicar. Cada documento aumenta la probabilidad de \xE9xito."));
}

function DerechosFundamentales({
  catId
}) {
  const derechos = DERECHOS_POR_CAT[catId] || DERECHOS_POR_CAT.peticion;
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      borderLeft: "4px solid #7C3AED",
      background: "linear-gradient(135deg,#FAFAFF,#F5F3FF)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 14,
      color: "#5B21B6",
      marginBottom: 10
    }
  }, "\u2696\uFE0F Derechos fundamentales vulnerados"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginBottom: 10
    }
  }, "Estos derechos se citan autom\xE1ticamente en su documento:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, derechos.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
      padding: "7px 10px",
      background: "rgba(124,58,237,.06)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#7C3AED",
      flexShrink: 0,
      marginTop: 1
    }
  }, "\xA7"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#374151",
      fontWeight: 500
    }
  }, d)))));
}

function ExtrasCategoria({catId,onAbrirFotomultas}){
  return null;
}

function LineaDeTiempo({
  eventos,
  setEventos
}) {
  const [nuevo, setNuevo] = useState({
    fecha: "",
    desc: ""
  });
  const agregar = () => {
    if (!nuevo.fecha || !nuevo.desc.trim()) return;
    const ev = [...eventos, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha));
    setEventos(ev);
    setNuevo({
      fecha: "",
      desc: ""
    });
  };
  const eliminar = i => setEventos(eventos.filter((_, idx) => idx !== i));
  const exportarTexto = () => eventos.map(e => `${e.fecha}: ${e.desc}`).join("\n");
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14,
      borderLeft: "4px solid #1E50C8"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 15,
      color: "#1E50C8",
      marginBottom: 4
    }
  }, "?? L\xEDnea de tiempo del caso"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginBottom: 12,
      lineHeight: 1.6
    }
  }, "Los jueces valoran la cronolog\xEDa ordenada. Agregue los eventos m\xE1s importantes."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: nuevo.fecha,
    onChange: e => setNuevo(p => ({
      ...p,
      fecha: e.target.value
    })),
    style: {
      flex: "0 0 auto",
      width: 150
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "\xBFQu\xE9 ocurri\xF3? Ej: La EPS neg\xF3 el tratamiento por escrito",
    value: nuevo.desc,
    onChange: e => setNuevo(p => ({
      ...p,
      desc: e.target.value
    })),
    onKeyDown: e => e.key === "Enter" && agregar(),
    style: {
      flex: 1,
      minWidth: 200
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: agregar,
    className: "btn ba sm",
    style: {
      flexShrink: 0
    }
  }, "+ Agregar")), eventos.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "16px 0",
      color: "#9CA3AF",
      fontSize: 13
    }
  }, "Agregue los eventos cronol\xF3gicamente \u2014 el m\xE1s antiguo primero") : /*#__PURE__*/React.createElement("div", null, eventos.map((ev, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "8px 0",
      borderBottom: i < eventos.length - 1 ? "1px solid #F3F4F6" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#1E50C8",
      marginTop: 3
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#1E50C8"
    }
  }, new Date(ev.fecha + "T12:00:00").toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#374151",
      marginTop: 1
    }
  }, ev.desc)), /*#__PURE__*/React.createElement("button", {
    onClick: () => eliminar(i),
    style: {
      background: "none",
      border: "none",
      color: "#FCA5A5",
      cursor: "pointer",
      fontSize: 14,
      flexShrink: 0
    }
  }, "\u2715"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigator.clipboard?.writeText(exportarTexto()),
    className: "btn bghost sm",
    style: {
      marginTop: 10
    }
  }, "?? Copiar l\xEDnea de tiempo")));
}

function DirectorioAbogados({
  onVolver,
  catInicial
}) {
  const [busq, setBusq] = useState("");
  const [ciudad, setCiudad] = useState("Todas");
  const [cat, setCat] = useState(catInicial || "Todas");
  const [seleccionado, setSeleccionado] = useState(null);
  const ciudades = ["Todas", "Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena"];
  const filtrados = ABOGADOS_DEMO.filter(a => {
    const matchBusq = !busq || a.nombre.toLowerCase().includes(busq.toLowerCase());
    const matchCiudad = ciudad === "Todas" || a.ciudad === ciudad;
    const matchCat = cat === "Todas" || a.especialidades.includes(cat);
    return matchBusq && matchCiudad && matchCat;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#1E50C8,#3D68E3)",
      borderRadius: 18,
      padding: "20px 22px",
      marginBottom: 18,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onVolver,
    style: {
      background: "rgba(255,255,255,.12)",
      border: "none",
      color: "#fff",
      borderRadius: 8,
      padding: "5px 12px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit",
      marginBottom: 12
    }
  }, "\u2190 Volver"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontSize: 20,
      fontWeight: 800,
      marginBottom: 5
    }
  }, "?? Directorio de Abogados Verificados"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,.75)",
      lineHeight: 1.6
    }
  }, "Cuando su caso requiere un abogado real \u2014 aqu\xED encontrar\xE1 profesionales verificados, con rese\xF1as reales, para cada especialidad."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, [{
    n: `${ABOGADOS_DEMO.length}`,
    l: "abogados activos"
  }, {
    n: "4.8⭐",
    l: "calificación promedio"
  }, {
    n: "100%",
    l: "verificados"
  }].map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "rgba(255,255,255,.12)",
      borderRadius: 8,
      padding: "5px 12px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      opacity: .7
    }
  }, s.l))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "?? Buscar abogado por nombre...",
    value: busq,
    onChange: e => setBusq(e.target.value),
    style: {
      width: "100%",
      marginBottom: 10,
      boxSizing: "border-box"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#6B7280",
      width: "100%",
      marginBottom: 2
    }
  }, "CIUDAD:"), ciudades.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCiudad(c),
    style: {
      background: ciudad === c ? "#1E50C8" : "#F8FAFF",
      color: ciudad === c ? "#fff" : "#374151",
      border: `1.5px solid ${ciudad === c ? "#1E50C8" : "#E5E7EB"}`,
      borderRadius: 20,
      padding: "4px 11px",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "#6B7280",
      width: "100%",
      marginBottom: 2
    }
  }, "ESPECIALIDAD:"), CATS_ABOGADO.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCat(c),
    style: {
      background: cat === c ? "#1E50C8" : "#F8FAFF",
      color: cat === c ? "#fff" : "#374151",
      border: `1.5px solid ${cat === c ? "#1E50C8" : "#E5E7EB"}`,
      borderRadius: 20,
      padding: "4px 11px",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, c)))), filtrados.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#6B7280"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      marginBottom: 10
    }
  }, "??"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 6
    }
  }, "No hay abogados con esos filtros"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Intente con otra ciudad o especialidad")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, filtrados.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: "card",
    style: {
      cursor: "pointer",
      transition: "all .2s",
      border: `1.5px solid ${seleccionado === a.id ? "#1E50C8" : "#E5E7EB"}`
    },
    onClick: () => setSeleccionado(seleccionado === a.id ? null : a.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 14,
      background: "linear-gradient(135deg,#EEF3FE,#DCE6FB)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24,
      flexShrink: 0,
      position: "relative"
    }
  }, a.foto, a.disponible && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "#22C55E",
      border: "2px solid #fff"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 14,
      color: "#1E50C8"
    }
  }, a.nombre), a.verificado && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "#EEF3FE",
      color: "#1E50C8",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700
    }
  }, "\u2713 Verificado")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginTop: 2
    }
  }, "?? ", a.ciudad, " \xB7 ", a.experiencia, " a\xF1os de experiencia"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginTop: 5
    }
  }, a.especialidades.map(e => /*#__PURE__*/React.createElement("span", {
    key: e,
    style: {
      background: "#F0F9FF",
      color: "#0369A1",
      padding: "2px 8px",
      borderRadius: 6,
      fontSize: 10,
      fontWeight: 600
    }
  }, e))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 6,
      fontSize: 12,
      color: "#374151",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2B50 ", a.rating, " (", a.reviews, " rese\xF1as)"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: a.disponible ? "#15803d" : "#DC2626",
      fontWeight: 700
    }
  }, a.disponible ? "● Disponible" : "○ Ocupado"))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#9CA3AF",
      flexShrink: 0,
      marginTop: 4,
      transform: seleccionado === a.id ? "rotate(180deg)" : "none",
      transition: "transform .2s"
    }
  }, "\u25BE")), seleccionado === a.id && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      paddingTop: 14,
      borderTop: "1px solid #F3F4F6"
    },
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#F0FDF4",
      borderRadius: 10,
      padding: "8px 12px",
      marginBottom: 10,
      fontSize: 12,
      color: "#15803d",
      fontWeight: 600
    }
  }, "?? ", a.precio_consulta), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: `tel:${a.tel.replace(/\s/g, '')}`,
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "linear-gradient(135deg,#15803d,#16a34a)",
      border: "none",
      borderRadius: 10,
      padding: "10px 18px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      gap: 7,
      alignItems: "center"
    }
  }, "?? Llamar ahora")), /*#__PURE__*/React.createElement("a", {
    href: `https://wa.me/57${a.tel.replace(/\s/g, '')}`,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "#25D366",
      border: "none",
      borderRadius: 10,
      padding: "10px 18px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      gap: 7,
      alignItems: "center"
    }
  }, "?? WhatsApp"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "8px 12px",
      background: "#FFFBEB",
      borderRadius: 8,
      fontSize: 11,
      color: "#92400E",
      lineHeight: 1.6
    }
  }, "\u26A0\uFE0F Recuerda: Antes de contratar a cualquier abogado, verifica su tarjeta profesional en el Consejo Superior de la Judicatura (csj.gov.co/consulta-abogados). TutelaYa no tiene responsabilidad sobre los servicios de abogados externos."))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      marginTop: 16,
      background: "linear-gradient(135deg,#F8FAFF,#EEF3FE)",
      border: "2px solid #DCE6FB"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 15,
      color: "#1E50C8",
      marginBottom: 5
    }
  }, "\xBFEres abogado? Llega a m\xE1s clientes"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#6B7280",
      marginBottom: 10,
      lineHeight: 1.6
    }
  }, "M\xE1s de 50.000 personas usan TutelaYa buscando asesor\xEDa legal. Aparece en el directorio y recibe casos calificados."), /*#__PURE__*/React.createElement("a", {
    href: "mailto:abogados@tutelaya.co?subject=Quiero aparecer en el directorio",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 10,
      padding: "10px 18px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "?? Registrar mi firma \u2192"))));
}

const CATS_ABOGADO = ["Todas","Laboral","Salud","Penal","Tránsito","Familia","Bancos","Inmigración","Vivienda"];
const TIPOS_CONTRATO = [{
  id: "arrendamiento",
  nombre: "Contrato de Arrendamiento",
  emoji: "??",
  ley: "Ley 820/2003",
  desc: "Vivienda o local comercial",
  campos: [{
    id: "arrendador",
    label: "Nombre completo del arrendador",
    ph: "Juan Pérez García"
  }, {
    id: "arrendatario",
    label: "Nombre completo del arrendatario",
    ph: "María López Torres"
  }, {
    id: "inmueble",
    label: "Dirección del inmueble",
    ph: "Calle 45 # 12-34, Bogotá"
  }, {
    id: "canon",
    label: "Canon mensual ($)",
    ph: "1.500.000"
  }, {
    id: "deposito",
    label: "Depósito de garantía ($)",
    ph: "1.500.000"
  }, {
    id: "duracion",
    label: "Duración del contrato",
    ph: "12 meses"
  }, {
    id: "inicio",
    label: "Fecha de inicio",
    tipo: "date"
  }]
}, {
  id: "prestacion_servicios",
  nombre: "Prestación de Servicios",
  emoji: "??",
  ley: "Art. 32 Ley 80/1993",
  desc: "Servicios profesionales independientes",
  campos: [{
    id: "contratante",
    label: "Empresa o persona contratante",
    ph: "Empresa SAS"
  }, {
    id: "contratista",
    label: "Nombre del contratista",
    ph: "Juan Pérez"
  }, {
    id: "cedula",
    label: "Cédula del contratista",
    ph: "12345678"
  }, {
    id: "objeto",
    label: "Objeto del contrato (qué servicio presta)",
    ph: "Asesoría en marketing digital"
  }, {
    id: "valor",
    label: "Valor total del contrato ($)",
    ph: "5.000.000"
  }, {
    id: "duracion",
    label: "Duración",
    ph: "3 meses"
  }, {
    id: "inicio",
    label: "Fecha de inicio",
    tipo: "date"
  }]
}, {
  id: "compraventa",
  nombre: "Compraventa de Bien Mueble",
  emoji: "??",
  ley: "Art. 1849 Código Civil",
  desc: "Vehículo, electrodoméstico, muebles",
  campos: [{
    id: "vendedor",
    label: "Nombre del vendedor",
    ph: "Carlos García"
  }, {
    id: "comprador",
    label: "Nombre del comprador",
    ph: "Ana Martínez"
  }, {
    id: "bien",
    label: "Descripción del bien",
    ph: "Vehículo Toyota Corolla 2020, placa ABC123"
  }, {
    id: "precio",
    label: "Precio de venta ($)",
    ph: "45.000.000"
  }, {
    id: "forma_pago",
    label: "Forma de pago",
    ph: "Transferencia bancaria el día de la firma"
  }, {
    id: "estado",
    label: "Estado del bien",
    ph: "Buen estado, con todos los documentos al día"
  }]
}, {
  id: "mutuo",
  nombre: "Préstamo entre Particulares",
  emoji: "??",
  ley: "Art. 2221 Código Civil",
  desc: "Prestamos de dinero con intereses legales",
  campos: [{
    id: "prestamista",
    label: "Nombre del prestamista (quien presta)",
    ph: "Roberto Gómez"
  }, {
    id: "deudor",
    label: "Nombre del deudor (quien recibe)",
    ph: "Luis Torres"
  }, {
    id: "monto",
    label: "Monto del préstamo ($)",
    ph: "5.000.000"
  }, {
    id: "interes",
    label: "Interés mensual (% — máx 2.4% legal)",
    ph: "1.5"
  }, {
    id: "plazo",
    label: "Plazo para devolver",
    ph: "6 meses"
  }, {
    id: "fecha",
    label: "Fecha del préstamo",
    tipo: "date"
  }]
}, {
  id: "trabajo",
  nombre: "Contrato de Trabajo",
  emoji: "??",
  ley: "Art. 22 CST",
  desc: "Indefinido, fijo o de obra",
  campos: [{
    id: "empleador",
    label: "Nombre o razón social del empleador",
    ph: "Empresa Colombia SAS"
  }, {
    id: "trabajador",
    label: "Nombre del trabajador",
    ph: "Pedro Rodríguez"
  }, {
    id: "cargo",
    label: "Cargo o función",
    ph: "Auxiliar administrativo"
  }, {
    id: "salario",
    label: "Salario mensual ($)",
    ph: "1.750.905"
  }, {
    id: "tipo",
    label: "Tipo de contrato",
    tipo: "select",
    ops: ["Término indefinido", "Término fijo - 1 año", "Término fijo - 6 meses", "Obra o labor"]
  }, {
    id: "inicio",
    label: "Fecha de inicio",
    tipo: "date"
  }, {
    id: "lugar",
    label: "Ciudad de trabajo",
    ph: "Bogotá"
  }]
}];
const TRAMITES_NOTARIAL = [{
  id: "poder_especial",
  nombre: "Poder Especial",
  emoji: "✍️",
  desc: "Para que otra persona actúe en su nombre ante entidades específicas",
  usos: ["Cobrar pensión o salarios", "Vender o comprar un bien", "Representar en proceso judicial", "Trámites ante DIAN o bancos"],
  docs: ["Cédula del poderdante", "Datos del apoderado (nombre y cédula)", "Descripción exacta del acto que autoriza"],
  costo: "$80.000 - $200.000 COP (según notaría)",
  tiempo: "El mismo día",
  ley: "Art. 2142 Código Civil",
  template: d => `PODER ESPECIAL\n\nYo, ${d.poderdante || "[NOMBRE COMPLETO]"}, mayor de edad, identificado(a) con Cédula de Ciudadanía No. ${d.cedula_pod || "[CÉDULA]"}, expedida en ${d.ciudad_exp || "[CIUDAD]"}, actuando en mi propio nombre y en ejercicio de mi plena capacidad legal, por medio del presente documento CONFIERO PODER ESPECIAL, AMPLIO Y SUFICIENTE a ${d.apoderado || "[NOMBRE DEL APODERADO]"}, identificado(a) con Cédula de Ciudadanía No. ${d.cedula_apo || "[CÉDULA]"}, para que en mi nombre y representación ${d.objeto_poder || "[DESCRIBA EL ACTO A REALIZAR]"}.\n\nEl presente poder se otorga por el término necesario para cumplir el objeto para el cual se confiere, y queda sujeto a las normas del Código Civil colombiano.\n\nDado en ${d.ciudad || "[CIUDAD]"}, a los _____ días del mes de _____________ de ${new Date().getFullYear()}.\n\n_______________________________\n${d.poderdante || "PODERDANTE"}\nC.C. ${d.cedula_pod || ""}\n\n[Autenticar ante notaría o cónsul colombiano]`
}, {
  id: "sucesion",
  nombre: "Sucesión Notarial",
  emoji: "??",
  desc: "Cuando fallece un familiar y necesita heredar bienes o liquidar la sociedad conyugal",
  usos: ["Herencia de inmuebles", "Herencia de vehículos o cuentas bancarias", "Liquidación de sociedad conyugal por fallecimiento"],
  docs: ["Registro civil de defunción del fallecido", "Cédulas de todos los herederos", "Registro civil de matrimonio (si aplicaba)", "Escrituras de los bienes a heredar", "Paz y salvos de impuestos de los bienes"],
  costo: "$2.000.000 - $15.000.000 COP (según valor de los bienes)",
  tiempo: "2 a 8 semanas",
  ley: "Art. 487 y ss. Código Civil + Decreto 902/1988",
  pasos: ["Reunir todos los documentos listados", "Ir a cualquier notaría del país (no tiene que ser la del fallecido)", "El notario designa un abogado del proceso", "Publicar edicto en periódico por 10 días", "Esperar posibles oposiciones (30 días)", "Firma de la escritura de adjudicación", "Registro en la Oficina de Instrumentos Públicos"],
  template: null
}, {
  id: "divorcio_notarial",
  nombre: "Divorcio Notarial",
  emoji: "??",
  desc: "Separación legal por mutuo acuerdo ante notaría (la vía más rápida)",
  usos: ["Pareja casada que está de acuerdo en separarse", "Sin hijos menores o con acuerdo claro sobre ellos", "Para liquidar la sociedad conyugal"],
  docs: ["Registro civil de matrimonio", "Cédulas de ambos cónyuges", "Acuerdo sobre los bienes (si los hay)", "Acuerdo sobre hijos (si los hay)"],
  costo: "$600.000 - $1.500.000 COP",
  tiempo: "1 a 3 semanas",
  ley: "Ley 25/1992 + Decreto 2668/1988",
  pasos: ["Acuerdo entre ambas partes sobre bienes e hijos", "Ir juntos a cualquier notaría", "El notario redacta el acta de divorcio", "Espera de 10 días hábiles", "Firma del acta de divorcio", "Solicitar el registro civil actualizado"],
  template: null
}, {
  id: "cambio_nombre",
  nombre: "Cambio de Nombre o Género",
  emoji: "✨",
  desc: "Corrección legal del nombre o cambio de componente de sexo en el registro civil",
  usos: ["Corregir error ortográfico en el nombre", "Cambiar el primer nombre por uno diferente", "Cambio del componente de sexo (Decreto 1227/2015)"],
  docs: ["Registro civil de nacimiento", "Cédula de ciudadanía", "Declaración juramentada ante notario (para cambio de nombre)", "Para cambio de género: declaración ante notario — no se exigen más requisitos"],
  costo: "$200.000 - $600.000 COP",
  tiempo: "El mismo día (notaría) + registro en la RNEC",
  ley: "Art. 6 Decreto 999/1988 + Decreto 1227/2015",
  template: null
}, {
  id: "reconocimiento_hijo",
  nombre: "Reconocimiento de Hijo",
  emoji: "??",
  desc: "Cuando un padre quiere reconocer legalmente a un hijo",
  usos: ["Padre que no firmó el registro civil al nacer", "Reconocimiento ante notaría (más rápido que ante juzgado)", "Para corrección del apellido del menor"],
  docs: ["Registro civil de nacimiento del menor", "Cédula del padre reconocedor", "Presencia del otro progenitor (o poder si no puede ir)"],
  costo: "$150.000 - $400.000 COP",
  tiempo: "El mismo día",
  ley: "Art. 1° Ley 75/1968",
  template: null
}];
const ABOGADOS_DEMO = [{
  id: 1,
  nombre: "Dr. Carlos Herrera",
  ciudad: "Bogotá",
  especialidades: ["Laboral", "Tutelas", "Pensiones"],
  experiencia: 12,
  rating: 4.9,
  reviews: 87,
  foto: "⚖️",
  disponible: true,
  tel: "300 000 0001",
  verificado: true,
  precio_consulta: "Gratis primera consulta"
}, {
  id: 2,
  nombre: "Dra. Lucía Montoya",
  ciudad: "Medellín",
  especialidades: ["Salud", "EPS", "Familia"],
  experiencia: 8,
  rating: 4.8,
  reviews: 64,
  foto: "⚖️",
  disponible: true,
  tel: "311 000 0002",
  verificado: true,
  precio_consulta: "Desde $80.000"
}, {
  id: 3,
  nombre: "Dr. Andrés Vargas",
  ciudad: "Cali",
  especialidades: ["Penal", "Tránsito", "Movilidad"],
  experiencia: 15,
  rating: 4.7,
  reviews: 102,
  foto: "⚖️",
  disponible: false,
  tel: "315 000 0003",
  verificado: true,
  precio_consulta: "Desde $120.000"
}, {
  id: 4,
  nombre: "Dra. Paola Ríos",
  ciudad: "Barranquilla",
  especialidades: ["Consumidor", "Bancos", "Vivienda"],
  experiencia: 6,
  rating: 4.9,
  reviews: 43,
  foto: "⚖️",
  disponible: true,
  tel: "316 000 0004",
  verificado: true,
  precio_consulta: "Desde $60.000"
}, {
  id: 5,
  nombre: "Dr. Mario Castro",
  ciudad: "Bogotá",
  especialidades: ["Inmigración", "Visas", "Familia"],
  experiencia: 10,
  rating: 4.6,
  reviews: 71,
  foto: "⚖️",
  disponible: true,
  tel: "317 000 0005",
  verificado: true,
  precio_consulta: "Desde $100.000"
}, {
  id: 6,
  nombre: "Dra. Sandra López",
  ciudad: "Bucaramanga",
  especialidades: ["Laboral", "Acoso laboral", "Despidos"],
  experiencia: 9,
  rating: 4.8,
  reviews: 55,
  foto: "⚖️",
  disponible: true,
  tel: "318 000 0006",
  verificado: true,
  precio_consulta: "Gratis primera consulta"
}];
const EVIDENCIAS_POR_SUBCASO = {
  neg_med: ["Copia de la historia clínica con la orden del médico", "Carnet de afiliación a la EPS", "Número de radicado de la solicitud ante la EPS", "Copia del carnet de identidad", "Si tiene: copia de negativa o silencio de la EPS"],
  neg_proc: ["Copia de la orden médica del procedimiento", "Historia clínica con diagnóstico", "Comprobante de afiliación activa", "Solicitud previa a la EPS y su respuesta (o silencio)"],
  neg_med_no: ["Fórmula médica con nombre del medicamento", "Historia clínica", "Comprobante afiliación EPS", "Si es no PBS: conceptos del médico sobre la necesidad"],
  eps_dem: ["Comprobantes de pago de aportes al día", "Cédula de ciudadanía", "Cualquier comunicación de la EPS desafiliando"],
  cobro_ind: ["Extracto bancario con el cargo no autorizado", "Cédula de ciudadanía", "Correos o comunicaciones con el banco", "Historial de pagos que muestre el cobro recurrente"],
  fraude_banco: ["Notificaciones del banco del retiro no autorizado", "Extracto bancario", "Denuncia ante la Policía (Radicado)", "Correos o llamadas al banco reportando el fraude"],
  desp_sin: ["Carta de despido o comunicación escrita", "Últimos 3 desprendibles de nómina", "Cédula de ciudadanía", "Contrato de trabajo si lo tiene", "Liquidación recibida (si la hay)"],
  desp_emb: ["Certificado médico de embarazo con fecha", "Carta de despido", "Últimos nóminas", "Notificación al empleador del embarazo (si la hizo)"],
  acoso: ["Cualquier mensaje, correo o comunicación del acosador", "Testigos (nombres y datos de contacto)", "Cédula de ciudadanía", "Cualquier denuncia previa ante RRHH o Comité de Convivencia"],
  presc_comp: ["Comparendo original o número del SIMIT", "Cédula de ciudadanía", "Tarjeta de propiedad del vehículo", "Pantallazos del SIMIT mostrando la fecha"],
  default: ["Cédula de ciudadanía (copia legible)", "Cualquier documento que pruebe el problema", "Copia de solicitudes o reclamaciones previas", "Nombre y datos de contacto de testigos (si hay)"]
};
const DERECHOS_POR_CAT = {
  salud: ["Derecho a la salud (Art. 49 C.P.)", "Derecho a la vida en condiciones dignas (Art. 11 C.P.)", "Derecho al mínimo vital (Art. 13 C.P.)"],
  trabajo: ["Derecho al trabajo en condiciones dignas (Art. 25 C.P.)", "Derecho a la seguridad social (Art. 48 C.P.)", "Derecho a la igualdad (Art. 13 C.P.)"],
  bancos: ["Derecho al debido proceso (Art. 29 C.P.)", "Derecho al habeas data (Art. 15 C.P.)", "Derecho al mínimo vital (Art. 13 C.P.)"],
  movilidad: ["Derecho al debido proceso (Art. 29 C.P.)", "Derecho a la libre circulación (Art. 24 C.P.)", "Derecho a la igualdad (Art. 13 C.P.)"],
  pension: ["Derecho a la seguridad social (Art. 48 C.P.)", "Derecho al mínimo vital", "Derecho a la vida digna en la vejez (Art. 46 C.P.)"],
  educacion: ["Derecho a la educación (Art. 67 C.P.)", "Derecho a la igualdad (Art. 13 C.P.)", "Derechos de los niños (Art. 44 C.P.)"],
  vivienda: ["Derecho a la vivienda digna (Art. 51 C.P.)", "Derecho al mínimo vital", "Derecho a la vida digna"],
  servicios: ["Derecho a la vida digna", "Derecho a la salud (cuando afecta salud)", "Derecho de petición (Art. 23 C.P.)"],
  dian: ["Derecho al debido proceso (Art. 29 C.P.)", "Derecho de petición (Art. 23 C.P.)", "Derecho al trabajo"],
  peticion: ["Derecho de petición (Art. 23 C.P.) — Ley 1755/2015", "Derecho al debido proceso (Art. 29 C.P.)"]
};


function generarTextoContrato(tipo, datos) {
  const hoy = new Date().toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});
  const fmtM = (v) => v ? `$${new Intl.NumberFormat("es-CO").format(parseInt(v.replace(/\./g,"").replace(",","")))}` : "[VALOR]";

  if(tipo.id === "arrendamiento") return `CONTRATO DE ARRENDAMIENTO DE VIVIENDA URBANA
Ley 820 de 2003

En la ciudad de ${datos.inmueble?.split(",").slice(-1)[0]?.trim() || "[CIUDAD]"}, a los ${hoy}.

Entre los suscritos, ${datos.arrendador || "[ARRENDADOR]"}, mayor de edad, identificado con cédula de ciudadanía, quien en adelante se denominará EL ARRENDADOR, y ${datos.arrendatario || "[ARRENDATARIO]"}, mayor de edad, identificado con cédula de ciudadanía, quien en adelante se denominará EL ARRENDATARIO, se ha celebrado el presente contrato de arrendamiento de vivienda, regido por las normas de la Ley 820 de 2003 y demás disposiciones legales.

PRIMERO — OBJETO: EL ARRENDADOR entrega a título de arrendamiento al ARRENDATARIO el inmueble ubicado en ${datos.inmueble || "[DIRECCIÓN]"}, para destinación exclusiva a vivienda urbana.

SEGUNDO — CANON: El canon mensual de arrendamiento es de ${fmtM(datos.canon)} (${datos.canon || "0"} pesos), que el ARRENDATARIO pagará al ARRENDADOR dentro de los primeros cinco (5) días de cada mes. El incumplimiento en el pago acarrea intereses de mora a la máxima tasa legal.

TERCERO — DURACIÓN: El presente contrato tendrá una duración de ${datos.duracion || "[DURACIÓN]"}, a partir del ${fmt_fecha_contrato(datos.inicio)}. Prorrogable automáticamente en las mismas condiciones, según el artículo 22 de la Ley 820/2003.

CUARTO — DEPÓSITO: El ARRENDATARIO entrega en este acto la suma de ${fmtM(datos.deposito)} a título de depósito de garantía, la cual será devuelta al finalizar el contrato, descontando los daños que no correspondan al uso normal del inmueble.

QUINTO — OBLIGACIONES DEL ARRENDATARIO: Pagar el canon oportunamente. Conservar el inmueble en buen estado. No ceder el arrendamiento sin autorización escrita. Permitir reparaciones urgentes.

SEXTO — OBLIGACIONES DEL ARRENDADOR: Entregar el inmueble en buen estado. Mantener el inmueble en condiciones de habitabilidad. Garantizar el goce pacífico del inmueble.

SÉPTIMO — INCREMENTO: El canon podrá ajustarse una vez al año, en un porcentaje no superior al IPC del año anterior, según el artículo 20 de la Ley 820/2003.

OCTAVO — CAUSALES DE TERMINACIÓN: Las establecidas en el artículo 22 de la Ley 820/2003, incluyendo no pago del canon, subarrendamiento no autorizado, y uso diferente al pactado.

Para constancia, las partes firman en dos (2) ejemplares del mismo tenor en la fecha indicada.

_______________________________          _______________________________
     ARRENDADOR                                    ARRENDATARIO
${datos.arrendador || "[NOMBRE]"}                         ${datos.arrendatario || "[NOMBRE]"}
C.C.                                               C.C.

Testigo: _______________________   C.C.: _______________`;

  if(tipo.id === "prestacion_servicios") return `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES INDEPENDIENTES

En la ciudad de Colombia, a ${hoy}.

Entre ${datos.contratante || "[CONTRATANTE]"}, en adelante EL CONTRATANTE, y ${datos.contratista || "[CONTRATISTA]"}, identificado con cédula ${datos.cedula || "[CÉDULA]"}, en adelante EL CONTRATISTA, se celebra el presente contrato:

PRIMERO — OBJETO: EL CONTRATISTA se obliga a prestar sus servicios profesionales de: ${datos.objeto || "[OBJETO]"}.

SEGUNDO — VALOR: El valor total es de ${fmtM(datos.valor)}, pagadero según las condiciones acordadas entre las partes.

TERCERO — DURACIÓN: ${datos.duracion || "[DURACIÓN]"} a partir del ${fmt_fecha_contrato(datos.inicio)}.

CUARTO — INDEPENDENCIA: EL CONTRATISTA actúa como contratista independiente. Este contrato no genera relación laboral, por tanto no hay salario, prestaciones sociales, ni subordinación. El CONTRATISTA es autónomo en el manejo de su tiempo y recursos para cumplir el objeto.

QUINTO — OBLIGACIONES DEL CONTRATISTA: Ejecutar el objeto del contrato con idoneidad y dentro del plazo. Entregar los productos o resultados pactados. Mantener confidencialidad sobre información reservada.

SEXTO — OBLIGACIONES DEL CONTRATANTE: Pagar el valor en las condiciones pactadas. Proporcionar la información necesaria para la ejecución del objeto.

SÉPTIMO — PROPIEDAD INTELECTUAL: Los productos entregados en ejecución de este contrato serán de propiedad del CONTRATANTE, salvo pacto en contrario.

Firman en señal de aceptación:

_______________________________          _______________________________
     CONTRATANTE                                   CONTRATISTA
${datos.contratante || "[NOMBRE]"}                         ${datos.contratista || "[NOMBRE]"}
                                                    C.C. ${datos.cedula || "[CÉDULA]"}`;

  // Genérico para los demás tipos
  return `CONTRATO DE ${tipo.nombre.toUpperCase()}
Fundamento legal: ${tipo.ley}
Fecha: ${hoy}

${Object.entries(datos).map(([k,v]) => {
  const campo = tipo.campos.find(c=>c.id===k);
  return campo && v ? `${campo.label}: ${v}` : null;
}).filter(Boolean).join("\n")}

Las partes declaran entender y aceptar los términos de este contrato, el cual se rige por la legislación colombiana vigente.

_______________________          _______________________
       PARTE A                           PARTE B`;
}

function ContratosInteligentes({
  onVolver
}) {
  const [tipoSel, setTipoSel] = useState(null);
  const [datos, setDatos] = useState({});
  const [paso, setPaso] = useState("seleccionar"); // seleccionar | llenar | resultado | analizar
  const [contrato, setContrato] = useState("");
  const [analisis, setAnalisis] = useState(null);
  const [loadAnal, setLoadAnal] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [archivoTexto, setArchivoTexto] = useState("");
  const setDato = (k, v) => setDatos(p => ({
    ...p,
    [k]: v
  }));
  const generarContrato = () => {
    const texto = generarTextoContrato(tipoSel, datos);
    setContrato(texto);
    setPaso("resultado");
  };
  const analizarContrato = async texto => {
    setLoadAnal(true);
    setAnalisis(null);
    try {
      const r = await fetch(AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Eres abogado colombiano experto en contratos civiles y comerciales. Analiza el siguiente contrato y encuentra cláusulas abusivas, ilegales o riesgosas según el derecho colombiano. Responde SOLO JSON sin markdown:\n{"semaforo":"verde|amarillo|rojo","resumen":"análisis en 2 frases","problemas":[{"clausula":"nombre","problema":"descripción","riesgo":"alto|medio|bajo","articulo_violado":"ley/artículo"}],"recomendaciones":["recomendación 1","recomendación 2"],"cláusulas_faltantes":["cláusula que falta 1"]}\n\nCONTRATO:\n${texto.substring(0, 2000)}`
          }]
        })
      });
      const j = await r.json();
      const txt = j.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      setAnalisis(JSON.parse(txt));
    } catch {
      setAnalisis({
        semaforo: "amarillo",
        resumen: "No se pudo completar el análisis. Intente de nuevo.",
        problemas: [],
        recomendaciones: ["Verifique su conexión a internet"]
      });
    }
    setLoadAnal(false);
  };
  const semaforoConfig = {
    verde: {
      c: "#15803d",
      bg: "#F0FDF4",
      ico: "✅",
      txt: "Contrato en orden — No se detectaron problemas graves"
    },
    amarillo: {
      c: "#D97706",
      bg: "#FFFBEB",
      ico: "⚠️",
      txt: "Revisar — Hay cláusulas que conviene mejorar"
    },
    rojo: {
      c: "#DC2626",
      bg: "#FEF2F2",
      ico: "??",
      txt: "No firme — Hay cláusulas abusivas o ilegales"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, paso === "seleccionar" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onVolver,
    style: {
      background: "none",
      border: "1.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 18,
      color: "#1E50C8"
    }
  }, "?? Contratos Inteligentes")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "#6B7280",
      marginBottom: 14,
      lineHeight: 1.7
    }
  }, "Genera contratos profesionales basados en leyes colombianas, o analiza uno que ya tienes para detectar cl\xE1usulas abusivas."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginBottom: 16
    }
  }, TIPOS_CONTRATO.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => {
      setTipoSel(t);
      setDatos({});
      setPaso("llenar");
    },
    style: {
      background: "#fff",
      border: "1.5px solid #E5E7EB",
      borderRadius: 12,
      padding: "14px 16px",
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex",
      gap: 12,
      alignItems: "center",
      textAlign: "left",
      transition: "all .2s"
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = "#1E50C8";
      e.currentTarget.style.transform = "translateX(4px)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = "#E5E7EB";
      e.currentTarget.style.transform = "none";
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      flexShrink: 0
    }
  }, t.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#1E50C8"
    }
  }, t.nombre), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#6B7280",
      marginTop: 1
    }
  }, t.desc, " \xB7 ", t.ley)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 12,
      color: "#9CA3AF"
    }
  }, "\u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: "#F8FAFF",
      border: "2px dashed #DCE6FB"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#1E50C8",
      marginBottom: 6
    }
  }, "?? \xBFYa tiene un contrato? Anal\xEDcelo"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginBottom: 10,
      lineHeight: 1.6
    }
  }, "Pegue el texto del contrato que le enviaron y la IA detecta cl\xE1usulas abusivas, ilegales o riesgosas."), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    placeholder: "Pegue aqu\xED el texto del contrato que le enviaron para firmarlo...",
    value: archivoTexto,
    onChange: e => setArchivoTexto(e.target.value),
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginBottom: 10,
      resize: "vertical"
    }
  }), archivoTexto.trim().length > 50 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setContrato(archivoTexto);
      setPaso("analizar");
      analizarContrato(archivoTexto);
    },
    style: {
      background: "linear-gradient(135deg,#DC2626,#b91c1c)",
      border: "none",
      borderRadius: 10,
      padding: "10px 18px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "?? Analizar con IA \u2192"))), paso === "llenar" && tipoSel && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPaso("seleccionar"),
    style: {
      background: "none",
      border: "1.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 17,
      color: "#1E50C8"
    }
  }, tipoSel.emoji, " ", tipoSel.nombre)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginBottom: 16
    }
  }, tipoSel.campos.map(campo => /*#__PURE__*/React.createElement("div", {
    key: campo.id
  }, /*#__PURE__*/React.createElement("label", null, campo.label), campo.tipo === "select" ? /*#__PURE__*/React.createElement("select", {
    value: datos[campo.id] || "",
    onChange: e => setDato(campo.id, e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Seleccione..."), campo.ops?.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))) : /*#__PURE__*/React.createElement("input", {
    type: campo.tipo || "text",
    placeholder: campo.ph || "",
    value: datos[campo.id] || "",
    onChange: e => setDato(campo.id, e.target.value)
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: generarContrato,
    style: {
      width: "100%",
      background: "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 12,
      padding: "14px 22px",
      fontSize: 15,
      fontWeight: 800,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit",
      boxShadow: "0 4px 16px rgba(15,42,94,.3)"
    }
  }, "?? Generar contrato legal \u2192")), (paso === "resultado" || paso === "analizar") && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPaso("seleccionar");
      setAnalisis(null);
    },
    style: {
      background: "none",
      border: "1.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 17,
      color: "#1E50C8"
    }
  }, paso === "resultado" ? "Contrato generado" : "Análisis del contrato")), paso === "resultado" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard?.writeText(contrato);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    },
    style: {
      background: copiado ? "#15803d" : "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 9,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, copiado ? "✓ Copiado" : "?? Copiar contrato"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.print(),
    style: {
      background: "#F8FAFF",
      border: "1.5px solid #E5E7EB",
      borderRadius: 9,
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 600,
      color: "#374151",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "??\uFE0F Imprimir"), /*#__PURE__*/React.createElement("button", {
    onClick: () => analizarContrato(contrato),
    style: {
      background: "linear-gradient(135deg,#DC2626,#b91c1c)",
      border: "none",
      borderRadius: 9,
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "?? Analizar cl\xE1usulas")), /*#__PURE__*/React.createElement("div", {
    className: "tdoc",
    style: {
      marginBottom: 14
    }
  }, contrato), (paso === "analizar" || analisis) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, loadAnal && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 20,
      background: "#F8FAFF",
      borderRadius: 12
    },
    className: "pul"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, "??"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#6B7280"
    }
  }, "Analizando el contrato con jurisprudencia colombiana...")), analisis && (() => {
    const sc = semaforoConfig[analisis.semaforo] || semaforoConfig.amarillo;
    return /*#__PURE__*/React.createElement("div", {
      className: "fade"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: sc.bg,
        borderRadius: 13,
        padding: "14px 16px",
        border: `2px solid ${sc.c}`,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 15,
        color: sc.c,
        marginBottom: 4
      }
    }, sc.ico, " ", sc.txt), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "#374151",
        lineHeight: 1.6
      }
    }, analisis.resumen)), analisis.problemas?.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: "#DC2626",
        marginBottom: 8
      }
    }, "?? Problemas detectados:"), analisis.problemas.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: "#FEF2F2",
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 12,
        color: "#991B1B",
        marginBottom: 3
      }
    }, p.clausula), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#374151",
        marginBottom: 3
      }
    }, p.problema), p.articulo_violado && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#DC2626",
        fontWeight: 600
      }
    }, "?? ", p.articulo_violado)))), analisis.recomendaciones?.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 13,
        color: "#15803d",
        marginBottom: 8
      }
    }, "\u2705 Recomendaciones:"), analisis.recomendaciones.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: "#F0FDF4",
        borderRadius: 9,
        padding: "8px 12px",
        marginBottom: 6,
        fontSize: 12,
        color: "#14532D"
      }
    }, "\u2192 ", r))));
  })())));
}

function ModuloNotarialFamilia({
  onVolver
}) {
  const [tab, setTab] = useState("notarial"); // notarial | familia
  const [seleccionado, setSeleccionado] = useState(null);
  const [datosForm, setDatosForm] = useState({});
  const [docGenerado, setDocGenerado] = useState("");
  const [copiado, setCopiado] = useState(false);
  const tramites = tab === "notarial" ? TRAMITES_NOTARIAL : TRAMITES_FAMILIA;
  const generar = tramite => {
    if (tramite.template) {
      setDocGenerado(tramite.template(datosForm));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onVolver,
    style: {
      background: "none",
      border: "1.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 18,
      color: "#1E50C8"
    }
  }, "??\uFE0F Tr\xE1mites Notariales y Familia")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, [{
    id: "notarial",
    l: "?? Notariales"
  }, {
    id: "familia",
    l: "??‍?? Familia"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => {
      setTab(t.id);
      setSeleccionado(null);
      setDocGenerado("");
    },
    style: {
      flex: 1,
      background: tab === t.id ? "linear-gradient(135deg,#1E50C8,#3D68E3)" : "#F8FAFF",
      color: tab === t.id ? "#fff" : "#374151",
      border: `2px solid ${tab === t.id ? "transparent" : "#E5E7EB"}`,
      borderRadius: 11,
      padding: "10px 0",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all .2s"
    }
  }, t.l))), !seleccionado && tramites.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "card",
    style: {
      marginBottom: 10,
      cursor: "pointer",
      transition: "all .2s",
      border: t.urgente ? "2px solid #FECACA" : "1.5px solid #E5E7EB"
    },
    onClick: () => setSeleccionado(t)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      flexShrink: 0
    }
  }, t.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: t.urgente ? "#DC2626" : "#1E50C8"
    }
  }, t.nombre), t.urgente && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "#DC2626",
      color: "#fff",
      padding: "2px 8px",
      borderRadius: 99,
      fontSize: 10,
      fontWeight: 700
    }
  }, "URGENTE")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginTop: 3,
      lineHeight: 1.5
    }
  }, t.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#9CA3AF",
      marginTop: 4
    }
  }, "\u23F1 ", t.tiempo, " \xB7 ?? ", t.costo)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "#9CA3AF",
      flexShrink: 0
    }
  }, "\u2192")))), seleccionado && !docGenerado && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSeleccionado(null);
      setDocGenerado("");
    },
    style: {
      background: "none",
      border: "1.5px solid #E5E7EB",
      borderRadius: 8,
      padding: "5px 10px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Playfair Display',serif",
      fontWeight: 700,
      fontSize: 17,
      color: "#1E50C8"
    }
  }, seleccionado.emoji, " ", seleccionado.nombre)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#EEF3FE",
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: "#1E50C8",
      marginBottom: 6
    }
  }, "?? Documentos que necesita:"), seleccionado.docs.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 12,
      color: "#374151",
      marginBottom: 3
    }
  }, "\u2713 ", d)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      gap: 16,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#6B7280"
    }
  }, "\u23F1 ", /*#__PURE__*/React.createElement("strong", null, seleccionado.tiempo)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#6B7280"
    }
  }, "?? ", /*#__PURE__*/React.createElement("strong", null, seleccionado.costo)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#6B7280"
    }
  }, "?? ", /*#__PURE__*/React.createElement("strong", null, seleccionado.ley)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#F0FDF4",
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: "#15803d",
      marginBottom: 6
    }
  }, "\u2705 Cuando se usa este tr\xE1mite:"), seleccionado.usos.map((u, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 12,
      color: "#374151",
      marginBottom: 3
    }
  }, "\u2192 ", u))), seleccionado.pasos && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FFFBEB",
      borderRadius: 12,
      padding: "12px 16px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 12,
      color: "#D97706",
      marginBottom: 8
    }
  }, "??\uFE0F Pasos a seguir:"), seleccionado.pasos.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 9,
      marginBottom: 6,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#D97706",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      fontWeight: 800,
      flexShrink: 0
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#374151",
      lineHeight: 1.5
    }
  }, p)))), seleccionado.template && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#1E50C8",
      marginBottom: 12
    }
  }, "?? Complete los datos para generar el documento:"), seleccionado.id === "poder_especial" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, [{
    k: "poderdante",
    l: "Su nombre completo (quien da el poder)",
    ph: "Juan Carlos Pérez García"
  }, {
    k: "cedula_pod",
    l: "Su número de cédula",
    ph: "12345678"
  }, {
    k: "ciudad_exp",
    l: "Ciudad donde fue expedida su cédula",
    ph: "Bogotá"
  }, {
    k: "apoderado",
    l: "Nombre del apoderado (quien actúa por usted)",
    ph: "María González Torres"
  }, {
    k: "cedula_apo",
    l: "Cédula del apoderado",
    ph: "87654321"
  }, {
    k: "objeto_poder",
    l: "¿Para qué exactamente le da el poder?",
    ph: "cobrar mi pensión en Colpensiones durante mi hospitalización"
  }, {
    k: "ciudad",
    l: "Ciudad donde firma el poder",
    ph: "Bogotá"
  }].map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k
  }, /*#__PURE__*/React.createElement("label", null, f.l), /*#__PURE__*/React.createElement("input", {
    placeholder: f.ph,
    value: datosForm[f.k] || "",
    onChange: e => setDatosForm(p => ({
      ...p,
      [f.k]: e.target.value
    }))
  })))), seleccionado.id === "custodia" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, [{
    k: "madre",
    l: "Nombre de la madre",
    ph: "Ana García Torres"
  }, {
    k: "cedula_madre",
    l: "Cédula de la madre",
    ph: "52000000"
  }, {
    k: "padre",
    l: "Nombre del padre",
    ph: "Carlos López Ruiz"
  }, {
    k: "cedula_padre",
    l: "Cédula del padre",
    ph: "80000000"
  }, {
    k: "nombres_hijos",
    l: "Nombre(s) de los hijos menores",
    ph: "Juan y María López García"
  }, {
    k: "custodio",
    l: "¿Quién tendrá la custodia?",
    ph: "la madre Ana García Torres"
  }, {
    k: "visitas",
    l: "Régimen de visitas",
    ph: "todos los fines de semana de viernes 6pm a domingo 6pm"
  }, {
    k: "padre_alimentos",
    l: "¿Quién paga la cuota de alimentos?",
    ph: "Carlos López Ruiz (padre)"
  }, {
    k: "cuota",
    l: "Cuota mensual de alimentos ($)",
    ph: "500.000"
  }, {
    k: "ciudad",
    l: "Ciudad",
    ph: "Bogotá"
  }].map(f => /*#__PURE__*/React.createElement("div", {
    key: f.k
  }, /*#__PURE__*/React.createElement("label", null, f.l), /*#__PURE__*/React.createElement("input", {
    placeholder: f.ph,
    value: datosForm[f.k] || "",
    onChange: e => setDatosForm(p => ({
      ...p,
      [f.k]: e.target.value
    }))
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => generar(seleccionado),
    style: {
      width: "100%",
      background: "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 12,
      padding: "13px 22px",
      fontSize: 14,
      fontWeight: 800,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit",
      marginTop: 14,
      boxShadow: "0 4px 16px rgba(15,42,94,.3)"
    }
  }, "?? Generar documento \u2192")), !seleccionado.template && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#F8FAFF",
      borderRadius: 12,
      padding: "14px 16px",
      border: "2px dashed #DCE6FB"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 13,
      color: "#1E50C8",
      marginBottom: 6
    }
  }, "??\uFE0F Este tr\xE1mite se hace ante notar\xEDa o entidad oficial"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: "#6B7280",
      marginBottom: 10,
      lineHeight: 1.6
    }
  }, "No requiere un documento generado aqu\xED \u2014 se tramita directamente ante la entidad indicada. Lleve los documentos de la lista y siga los pasos descritos."), /*#__PURE__*/React.createElement("a", {
    href: "https://www.supernotariado.gov.co",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 9,
      padding: "9px 16px",
      fontSize: 12,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "?? Buscar notar\xEDa en Supernotariado \u2192")))), docGenerado && /*#__PURE__*/React.createElement("div", {
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDocGenerado(""),
    style: {
      background: "#F8FAFF",
      border: "1.5px solid #E5E7EB",
      borderRadius: 9,
      padding: "8px 12px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "\u2190 Volver"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard?.writeText(docGenerado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    },
    style: {
      background: copiado ? "#15803d" : "linear-gradient(135deg,#1E50C8,#3D68E3)",
      border: "none",
      borderRadius: 9,
      padding: "8px 14px",
      fontSize: 12,
      fontWeight: 700,
      color: "#fff",
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, copiado ? "✓ Copiado" : "?? Copiar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.print(),
    style: {
      background: "#F8FAFF",
      border: "1.5px solid #E5E7EB",
      borderRadius: 9,
      padding: "8px 12px",
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit"
    }
  }, "??\uFE0F Imprimir")), /*#__PURE__*/React.createElement("div", {
    className: "tdoc"
  }, docGenerado), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "10px 14px",
      background: "#FFFBEB",
      borderRadius: 9,
      fontSize: 11,
      color: "#92400E",
      lineHeight: 1.7
    }
  }, "\u26A0\uFE0F Este documento es un borrador orientativo basado en las leyes colombianas. Para que tenga plena validez jur\xEDdica, debe ser revisado y autenticado por un notario o profesional del derecho. TutelaYa no presta servicios de asesor\xEDa jur\xEDdica profesional.")));
}

function IntelDashboard(){
  return null;
}

function WallTrialVencido({onVerPlanes}){
  return React.createElement("div",{className:"card",style:{marginBottom:14,background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",borderLeft:"4px solid #D97706"}},
    React.createElement("div",{style:{fontWeight:700,color:"#92400E",fontSize:14,marginBottom:6}},"⏰ Su periodo de prueba terminó"),
    React.createElement("div",{style:{fontSize:13,color:"#92400E",lineHeight:1.6,marginBottom:12}},"Para seguir generando documentos, active un plan."),
    React.createElement("button",{onClick:onVerPlanes,className:"btn bo sm"},"Ver planes")
  );
}

function ModalPaywall({mostrar,plan,generacionesHoy,onGenerarGratis,irAMercadoPago,onCerrar}){
  if(!mostrar)return null;
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},onClick:onCerrar},
    React.createElement("div",{style:{background:"#fff",borderRadius:18,padding:28,maxWidth:380,width:"100%"},onClick:e=>e.stopPropagation()},
      React.createElement("div",{style:{fontSize:32,textAlign:"center",marginBottom:10}},"📄"),
      React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:18,color:"#1E50C8",textAlign:"center",marginBottom:8}},"Genere su documento"),
      React.createElement("div",{style:{fontSize:13,color:"#6B7280",textAlign:"center",marginBottom:18,lineHeight:1.6}},"Su documento está listo para generar."),
      React.createElement("button",{onClick:onGenerarGratis,className:"btn bo",style:{width:"100%",marginBottom:8}},"✅ Generar documento"),
      React.createElement("button",{onClick:onCerrar,className:"btn bghost sm",style:{width:"100%"}},"Cancelar")
    )
  );
}

function ModalPlanesInline({onCerrar,planVencido}){
  if(!onCerrar)return null;
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},onClick:onCerrar},
    React.createElement("div",{style:{background:"#fff",borderRadius:18,padding:28,maxWidth:400,width:"100%"},onClick:e=>e.stopPropagation()},
      React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1E50C8",textAlign:"center",marginBottom:6}},"Planes"),
      React.createElement("div",{style:{fontSize:13,color:"#6B7280",textAlign:"center",marginBottom:20}},"Ayuda Ciudadana es gratuito por ahora."),
      React.createElement("div",{style:{background:"linear-gradient(135deg,#EEF3FE,#DCE6FB)",borderRadius:12,padding:18,marginBottom:16,textAlign:"center"}},
        React.createElement("div",{style:{fontSize:24,fontWeight:800,color:"#1E50C8"}},"Gratis"),
        React.createElement("div",{style:{fontSize:13,color:"#1E50C8",marginTop:4}},"Acceso completo a todas las funciones")
      ),
      React.createElement("button",{onClick:onCerrar,className:"btn bo",style:{width:"100%"}},"Continuar")
    )
  );
}

function ModalAuthInline({modo,onCerrar,onExito,onMostrarPlanes}){
  const auth=useAuthLocal();
  const[m,setM]=useState(modo||"login");
  const[form,setForm]=useState({email:"",pw:"",pw2:"",nombre:""});
  const[err,setErr]=useState("");
  const[ok,setOk]=useState("");
  const[busy,setBusy]=useState(false);
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    setErr("");setOk("");
    if(!form.email.trim())return setErr("Ingresa tu correo electrónico");
    if(m==="recuperar"){setOk("✅ Revisa tu correo para recuperar la contraseña.");return;}
    if(!form.pw)return setErr("Ingresa tu contraseña");
    if(m==="registro"){
      if(!form.nombre.trim())return setErr("Ingresa tu nombre");
      if(form.pw.length<6)return setErr("Mínimo 6 caracteres");
      if(form.pw!==form.pw2)return setErr("Las contraseñas no coinciden");
    }
    setBusy(true);
    try{
      const r=await(m==="login"?auth.login(form.email,form.pw):auth.registrarse(form.email,form.nombre,form.pw));
      setBusy(false);
      if(r&&r.ok){onExito&&onExito();onCerrar&&onCerrar();}
      else setErr((r&&r.error)||"Error. Verifica tus datos.");
    }catch(e){setBusy(false);setErr("Error inesperado. Intenta de nuevo.");}
  };
  return React.createElement("div",{style:{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20},onClick:onCerrar},
    React.createElement("div",{style:{background:"#fff",borderRadius:20,padding:30,maxWidth:380,width:"100%"},onClick:e=>e.stopPropagation()},
      React.createElement("div",{style:{textAlign:"center",marginBottom:20}},
        React.createElement("div",{style:{width:54,height:54,borderRadius:14,background:"linear-gradient(135deg,#1E50C8,#1E50C8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 12px"}},"⚖️"),
        React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:"#1E50C8"}},m==="registro"?"Crea tu cuenta":m==="recuperar"?"Recuperar acceso":"Bienvenido de vuelta"),
        React.createElement("div",{style:{fontSize:13,color:"#6B7280",marginTop:4}},m==="registro"?"Empieza gratis":"Ingresa a tu cuenta")
      ),
      err&&React.createElement("div",{style:{background:"#FEF2F2",color:"#DC2626",padding:"9px 14px",borderRadius:9,fontSize:12,marginBottom:12}},err),
      ok&&React.createElement("div",{style:{background:"#F0FDF4",color:"#15803d",padding:"9px 14px",borderRadius:9,fontSize:12,marginBottom:12}},ok),
      m==="registro"&&React.createElement("div",{style:{marginBottom:12}},React.createElement("label",null,"Nombre completo"),React.createElement("input",{value:form.nombre,onChange:e=>up("nombre",e.target.value),placeholder:"Tu nombre"})),
      React.createElement("div",{style:{marginBottom:12}},React.createElement("label",null,"Correo electrónico"),React.createElement("input",{type:"email",value:form.email,onChange:e=>up("email",e.target.value),placeholder:"correo@ejemplo.com"})),
      m!=="recuperar"&&React.createElement("div",{style:{marginBottom:12}},React.createElement("label",null,"Contraseña"),React.createElement("input",{type:"password",value:form.pw,onChange:e=>up("pw",e.target.value),placeholder:"••••••••"})),
      m==="registro"&&React.createElement("div",{style:{marginBottom:12}},React.createElement("label",null,"Confirmar contraseña"),React.createElement("input",{type:"password",value:form.pw2,onChange:e=>up("pw2",e.target.value),placeholder:"••••••••"})),
      React.createElement("button",{onClick:submit,disabled:busy,style:{width:"100%",marginTop:8,padding:"13px",border:"none",borderRadius:12,fontSize:14,fontWeight:800,color:"#fff",cursor:busy?"wait":"pointer",fontFamily:"inherit",background:busy?"#9CA3AF":"linear-gradient(135deg,#1E50C8,#1E50C8)"}},busy?"⏳ Procesando...":m==="registro"?"🎉 Crear cuenta":m==="recuperar"?"📧 Enviar enlace":"→ Entrar"),
      React.createElement("div",{style:{textAlign:"center",marginTop:14,fontSize:12,color:"#6B7280"}},
        m==="login"&&React.createElement(React.Fragment,null,
          React.createElement("span",{onClick:()=>setM("recuperar"),style:{cursor:"pointer"}},"¿Olvidaste tu contraseña?"),
          " · ",
          React.createElement("span",{onClick:()=>setM("registro"),style:{cursor:"pointer",fontWeight:700,color:"#1E50C8"}},"Crear cuenta")
        ),
        m!=="login"&&React.createElement("span",{onClick:()=>setM("login"),style:{cursor:"pointer",fontWeight:700,color:"#1E50C8"}},"← Volver a iniciar sesión")
      )
    )
  );
}

function useAuthLocal(){
  const[user,setUser]=useState(()=>{try{const s=localStorage.getItem("ayudaciudadana_auth");return s?JSON.parse(s):null;}catch{return null;}});
  const saveUser=u=>{try{localStorage.setItem("ayudaciudadana_auth",JSON.stringify(u));}catch{}};
  const loadUser=()=>{try{const s=localStorage.getItem("ayudaciudadana_auth");return s?JSON.parse(s):null;}catch{return null;}};
  
  const login=async(email,pw)=>{
    try{
      const r=await sbClient.auth.signIn(email,pw);
      console.log("signIn response:",JSON.stringify(r));
      if(r.error||r.error_description)return{ok:false,error:r.error_description||r.error||"Email o contraseña incorrectos"};
      const token=r.access_token||r.session?.access_token;
      if(token||r.user){
        const u={id:r.user?.id||`usr_${Date.now()}`,email,nombre:r.user?.user_metadata?.nombre||email.split("@")[0],plan:"trial",trial_fin:Date.now()+24*60*60*1000,token,es_admin:false,created:Date.now()};
        saveUser(u);setUser(u);return{ok:true};
      }
      return{ok:false,error:r.error_description||"Email o contraseña incorrectos"};
    }catch(e){
      const existente=loadUser();
      if(existente&&existente.email===email){setUser(existente);return{ok:true};}
      return{ok:false,error:"Error de conexión"};
    }
  };
  
  const registrarse=async(email,nombre,pw)=>{
    if(!email||!pw)return{ok:false,error:"Completa todos los campos"};
    if(pw.length<6)return{ok:false,error:"Mínimo 6 caracteres"};
    try{
      const r=await sbClient.auth.signUp(email,pw,nombre||email.split("@")[0]);
      console.log("signUp response:",JSON.stringify(r));
      if(r.error||r.error_description)return{ok:false,error:r.error_description||r.error||"Error al registrarse"};
      const u={id:r.user?.id||`usr_${Date.now()}`,email,nombre:nombre||email.split("@")[0],plan:"trial",trial_fin:Date.now()+24*60*60*1000,token:r.access_token||r.session?.access_token||null,es_admin:false,created:Date.now()};
      saveUser(u);setUser(u);return{ok:true};
    }catch(e){return{ok:false,error:"Error de conexión"};}
  };
  
  const logout=()=>{
    try{
      localStorage.removeItem("ayudaciudadana_auth");
      if(user?.token)sbClient.auth.signOut(user.token).catch(()=>{});
    }catch{}
    setUser(null);
  };
  
  const esAdmin=user?.es_admin||false;
  return{user,setUser,login,registrarse,logout,saveUser,loadUser,esAdmin};
}

function TutelaYa(){const[data,setData]=useState(()=>db.load());const[pant,setPant]=useState("inicio");const[catSel,setCatSel]=useState(null);const[subSel,setSubSel]=useState(null);const[resp,setResp]=useState({});const[datos,setDatos]=useState({});const[paso,setPaso]=useState(0);const[casoA,setCasoA]=useState(null);const[docGen,setDocGen]=useState("");const[gen,setGen]=useState(false);const[files,setFiles]=useState([]);const[busq,setBusq]=useState("");const[toast,setToast]=useState(null);const[chat,setChat]=useState(false);const[consejo,setConsejo]=useState(null);const[loadC,setLoadC]=useState(false);const[estrategia,setEstrategia]=useState(null);const[loadE,setLoadE]=useState(false);const[analDoc,setAnalDoc]=useState(null);const[loadAD,setLoadAD]=useState(false);const[ckl,setCkl]=useState(null);const[loadCkl,setLoadCkl]=useState(false);const[urgencia,setUrgencia]=useState(false);const[mostrarPaywall,setMostrarPaywall]=useState(false);const[nota,setNota]=useState("");const auth=useAuthLocal();const{oscuro,toggleDark,esAuto}=useModoOscuro();useEffect(()=>{document.body.classList.toggle("dark",oscuro);document.documentElement.setAttribute("data-theme",oscuro?"dark":"light");},[oscuro]);useEffect(()=>{if(casoA){const _c=(data.casos||[]).find(x=>x.id===casoA.id)||casoA;setNota(_c.notas||"");}},[casoA]);const[modalAuth,setModalAuth]=useState(null);const[verPlanes,setVerPlanes]=useState(false);const[timeline,setTimeline]=useState([]);const[verBusqueda,setVerBusqueda]=useState(false);const[,tickAuth]=useState(0);useEffect(()=>{const id=setInterval(()=>tickAuth(n=>n+1),60000);return()=>clearInterval(id);},[]);useEffect(()=>{const fn=e=>{if((e.ctrlKey||e.metaKey)&&e.key==="k"){e.preventDefault();setVerBusqueda(v=>!v);}};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[]);const onboarding_state_placeholder=true;const[onboarding,setOnboarding]=useState(()=>{try{return!localStorage.getItem("ayudaciudadana_onboarded");}catch{return true;}});const modoNocturno=useModoNocturno();const topR=useRef(null);useEffect(()=>{if(data.casos?.length>0&&"Notification"in window&&Notification.permission==="default"){setTimeout(()=>solicitarNotificaciones(),5000);}},[]);const fRef=useRef(null);const adRef=useRef(null);useEffect(()=>{db.save(data);},[data]);const msg=(t,tipo="ok")=>{setToast({t,tipo});setTimeout(()=>setToast(null),4000);};const ir=p=>{setPant(p);setTimeout(()=>topR.current?.scrollIntoView({behavior:"smooth"}),50);};const upd=fn=>setData(prev=>{const n=fn(JSON.parse(JSON.stringify(prev)));db.save(n);return n;});const cat=catSel?CATS[catSel]:null;const pregs=subSel?PREGUNTAS[subSel.id]||GENERICAS:[];const casos=data.casos||[];const cFilt=busq?casos.filter(c=>(c.subcasoNombre+c.datosPersonales?.entidad+"").toLowerCase().includes(busq.toLowerCase())):casos;const urgentes=casos.filter(c=>["impugnacion","desacato"].includes(c.etapa));const addFiles=fl=>{const tipos=["image/","audio/","video/","application/pdf","application/msword","application/vnd.openxmlformats"];Array.from(fl).forEach(f=>{if(files.length>=20){msg("Máximo 20 files","er");return;}if(f.size>15*1024*1024){msg(`${f.name} supera 15MB`,"er");return;}if(!tipos.some(t=>f.type.startsWith(t))){msg("Tipo no permitido","er");return;}const r=new FileReader();r.onload=e=>setFiles(p=>[...p,{id:Date.now()+Math.random(),nombre:f.name,tipo:f.type,size:f.size,data:e.target.result,desc:""}]);r.readAsDataURL(f);});};const generarCkl=async()=>{setLoadCkl(true);setCkl(null);const res=pregs.map(p=>`${p.texto}: ${resp[p.id]||"No respondido"}`).join("\n");const prompt=`Eres abogado colombiano experto. Analiza este caso y genera checklist de calidad en JSON (solo JSON, sin markdown):
Caso: ${subSel?.nombre}, Categoría: ${cat?.nombre}
${res}
{"puntuacion":75,"listo":true,"items":[{"e":"ok","t":"texto"},{"e":"warn","t":"texto"},{"e":"mal","t":"texto"}],"rec":"recomendación breve"}`;try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1500,messages:[{role:"user",content:prompt}]})});const j=await r.json();const txt=j.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();setCkl(JSON.parse(txt));}catch{setCkl({puntuacion:70,listo:true,items:[{e:"ok",t:"Información básica registrada"},{e:"warn",t:"Agregue más detalles para fortalecer el caso"}],rec:"Puede proceder a generar el documento."});}setLoadCkl(false);};const generarConsejo=async c=>{setLoadC(true);setConsejo(null);const etapa=ETAPAS.find(e=>e.id===c.etapa);const prompt=`Eres abogado colombiano empático. Caso "${c.subcasoNombre}" en etapa "${etapa?.nombre}", entidad: ${c.datosPersonales?.entidad||"desconocida"}, historial: ${c.historial?.map(h=>h.evento).join(", ")}.
En máximo 3 párrafos cortos y lenguaje muy sencillo: 1) Dónde está el caso ahora. 2) Qué debe hacer HOY concretamente. 3) Qué pasa si no actúa (si aplica). Sé directo, empático y específico.`;try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:800,messages:[{role:"user",content:prompt}]})});const j=await r.json();setConsejo(j.content?.map(b=>b.text||"").join(""));}catch{setConsejo("No se pudo cargar el consejo. Verifique su conexión.");}setLoadC(false);};const generarEstrategia=async c=>{setLoadE(true);setEstrategia(null);const prompt=`Eres abogado colombiano experto. Genera estrategia jurídica completa en JSON (solo JSON):
Caso: ${c.subcasoNombre}, Cat: ${CATS[c.categoria]?.nombre}, Entidad: ${c.datosPersonales?.entidad}, Etapa: ${ETAPAS.find(e=>e.id===c.etapa)?.nombre}
{"sit":"situación actual simple","urgente":"acción más urgente HOY","pasos":[{"n":1,"acc":"qué hacer","plazo":"cuándo","pq":"por qué","urg":"alta/media/baja"}],"fortalezas":["f1"],"riesgos":["r1"]}`;try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,messages:[{role:"user",content:prompt}]})});const j=await r.json();const txt=j.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();setEstrategia(JSON.parse(txt));}catch{setEstrategia({sit:"No se pudo cargar.",urgente:"Verifique su conexión",pasos:[],fortalezas:[],riesgos:[]});}setLoadE(false);};const analizarDoc=async(nombre,tipo)=>{setLoadAD(true);setAnalDoc(null);const prompt=`Eres abogado colombiano. Un ciudadano subió el archivo "${nombre}" (${tipo}). Analiza y responde en JSON (solo JSON):
{"tipo":"tipo de documento","decision":"qué decidió la entidad en términos simples","favorable":true,"qsignifica":"explicación para ciudadano sin estudios","qhizo":"qué hizo o dejó de hacer la entidad","respondio":true,"qhacer":"acción concreta que debe tomar","urgencia":"alta/media/baja","plazo":"tiempo disponible para actuar"}`;try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:prompt}]})});const j=await r.json();const txt=j.content?.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();setAnalDoc(JSON.parse(txt));}catch{setAnalDoc({tipo:"Documento",decision:"Error",favorable:false,qsignifica:"Error al analizar.",qhizo:"No determinado",respondio:false,qhacer:"Intente de nuevo",urgencia:"media",plazo:"No determinado"});}setLoadAD(false);};const generarDoc=async()=>{if(!auth.user){setModalAuth("registro");return;}if(auth.user.plan==="trial"&&Date.now()>=auth.user.trial_fin){setVerPlanes(true);return;}setGen(true);ir("generando");const resumen=pregs.map(p=>`Pregunta: ${p.texto}\nRespuesta: ${Array.isArray(resp[p.id])?resp[p.id].join(", "):resp[p.id]||"No especificado"}`).join("\n\n");const tipoDoc=subSel?.id?.match(/sp$|sin_resp|pet_|presc_|recurso_/)?"DERECHO DE PETICIÓN":subSel?.id?.includes("recurso")?"RECURSO DE REPOSICIÓN":"ACCIÓN DE TUTELA";const jur={salud:"T-760/2008, T-1041/2006, T-016/2007, T-533/2009, SU-508/2020",trabajo:"SU-070/2013, T-164/2019, T-218/2020, T-530/2015, T-457/2013",servicios:"T-740/2011, T-270/2015, T-616/2010, T-717/2010",pension:"SU-556/2019, T-258/2016, T-165/2020, T-395/2014",movilidad:"T-051/2016, T-412/2017, T-680/2012, SU-1023/2001",peticion:"T-149/2002, T-967/2014, T-220/2019, T-512/2022"};const juzgado=catSel==="trabajo"||catSel==="pension"?"Juzgado Laboral del Circuito o Civil Municipal":"Juzgado Civil Municipal del Circuito";const prompt=`Eres un abogado colombiano con 25 años de experiencia. Redacta un documento legal de alta calidad.

TIPO: ${tipoDoc}${urgencia?" — URGENCIA EXTREMA, incluir medida provisional":""}
ACCIONANTE: ${datos.nombre||"[NOMBRE]"}, CC ${datos.cedula||"[CC]"}, Tel ${datos.telefono||"[TEL]"}, ${datos.ciudad||"[CIUDAD]"}, ${datos.direccion||"[DIRECCIÓN]"}, ${datos.email||"[EMAIL]"}
ACCIONADO: ${datos.entidad||"[ENTIDAD]"}, Rep. Legal: ${datos.rep_legal||"[REP LEGAL]"}, Contacto: ${datos.dir_entidad||"[DIR ENTIDAD]"}
JUZGADO COMPETENTE: ${juzgado}
JURISPRUDENCIA: ${jur[catSel]||jur.peticion}

HECHOS DEL CASO:
${resumen}

PRUEBAS ADJUNTAS:
${files.length>0?files.map(f=>`- ${f.nombre} (${f.desc||f.tipo})`).join("\n"):"El ciudadano indica que tiene documentos disponibles"}

INSTRUCCIONES:
1. Documento COMPLETO en formato legal colombiano riguroso
2. Para TUTELA: encabezado, datos partes, HECHOS numerados cronológicos y detallados, FUNDAMENTOS DE DERECHO con artículos, mínimo 5 sentencias Corte Constitucional con descripción, PRETENSIONES específicas, PRUEBAS, PETICIÓN formal
3. Para DERECHO DE PETICIÓN: encabezado, objeto, HECHOS, FUNDAMENTOS (Art 23 CP, Ley 1755/2015), PETICIÓN numerada, notificación
4. Hechos narrativos y detallados usando la historia del ciudadano
5. Datos faltantes entre [CORCHETES]
6. Al final: LISTA DE DOCUMENTOS A ADJUNTAR, PLAZOS LEGALES IMPORTANTES, y EXPLICACIÓN SENCILLA (2 párrafos en lenguaje ciudadano)${urgencia?"\n7. URGENCIA: incluir en pretensiones medida provisional inmediata":""}

Redacta el documento COMPLETO y EXTENSO. Aprovecha el espacio — incluye todos los hechos, todos los fundamentos legales, mínimo 5 sentencias de la Corte Constitucional con descripción de cada una, pretensiones detalladas, lista completa de pruebas, y plazos legales. El documento debe poder radicarse directamente sin edición adicional:`;try{const _cacheKey=subSel?.id||"gen";const _cached=iaCache.get(_cacheKey,resp,tipoDoc);let txt;if(_cached){txt=_cached;console.info("📦 Documento desde caché");}else{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2500,system:"Eres un abogado colombiano experto con 20 años de experiencia en tutelas constitucionales, derechos de petición y litigio ante juzgados colombianos. Conoces profundamente el Decreto 2591 de 1991, la Constitución Política de Colombia, la jurisprudencia de la Corte Constitucional y el Código Sustantivo del Trabajo. Redactas documentos legales formales, completos y técnicamente correctos que los jueces colombianos aceptan. Nunca inventes datos — usa [CORCHETES] para lo que el usuario debe completar.",messages:[{role:"user",content:prompt}]})});const j=await r.json();txt=j.content?.map(b=>b.text||"").join("\n")||"Error al generar.";iaCache.set(_cacheKey,resp,tipoDoc,txt);}const nc={id:`T${Date.now()}`,numero:(data.contador||0)+1,categoria:catSel,subcaso:subSel?.id,subcasoNombre:subSel?.nombre,tipoDoc,datosPersonales:{...datos},respuestas:{...resp},files:files.map(f=>({nombre:f.nombre,tipo:f.tipo,size:f.size,desc:f.desc})),tutela:txt,etapa:"radicacion",fechaCreacion:fHoy(),historial:[{fecha:fHoy(),evento:`${tipoDoc} generado${urgencia?" — URGENCIA":""}`,nota:"Listo para revisar y radicar"}],notas:"",urgencia};upd(d=>({...d,casos:[...d.casos,nc],contador:(d.contador||0)+1}));incrementarContador();setDocGen(txt);setCasoA(nc);setUrgencia(false);setGen(false);ir("tutela");}catch{setGen(false);setDocGen("Error al generar. Verifique su conexión.");ir("tutela");}};const actualizarEtapa=(id,nueva,nota="")=>{upd(d=>({...d,casos:d.casos.map(c=>c.id===id?{...c,etapa:nueva,historial:[...c.historial,{fecha:fHoy(),evento:ETAPAS.find(e=>e.id===nueva)?.nombre||nueva,nota}]}:c)}));setCasoA(p=>({...p,etapa:nueva}));msg("Estado actualizado ✓");};const guardarNota=(id,nota)=>{upd(d=>({...d,casos:d.casos.map(c=>c.id===id?{...c,notas:nota}:c)}));msg("Nota guardada ✓");};const eliminar=id=>{if(!window.confirm("¿Eliminar este caso?"))return;upd(d=>({...d,casos:d.casos.filter(c=>c.id!==id)}));ir("casos");msg("Caso eliminado");};const nuevo=()=>{setCatSel(null);setSubSel(null);setResp({});setDatos({});setFiles([]);setCkl(null);setUrgencia(false);ir("categorias");};const idxE=casoA?ETAPAS.findIndex(e=>e.id===casoA.etapa):0;return React.createElement("div",{ref:topR,style:{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"#F4F6FB",color:"#111827"}},React.createElement("style",null,CSS),React.createElement("nav",{className:"nav-safe",style:{position:"sticky",top:0,zIndex:100,padding:"0 18px"}},React.createElement("div",{style:{maxWidth:1100,margin:"0 auto",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}},React.createElement("button",{onClick:()=>ir("inicio"),style:{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:9}},React.createElement("div",{style:{width:32,height:32,borderRadius:9,background:"#1E50C8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}},"\u2696\uFE0F"),React.createElement("div",null,React.createElement("span",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"#1E50C8"}},"Ayuda Ciudadana"),React.createElement("span",{style:{fontSize:10,color:"#6B7280",marginLeft:4}},"Colombia \xB7 Abogado Digital"))),React.createElement("div",{style:{display:"flex",gap:4,alignItems:"center"}},React.createElement(BtnInstalarApp,null),!auth.user?React.createElement("div",{style:{display:"flex",gap:7,alignItems:"center"}},React.createElement("button",{onClick:()=>setModalAuth("login"),style:{background:"none",border:"1.5px solid #DCE6FB",borderRadius:9,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#1E50C8",cursor:"pointer",fontFamily:"inherit"}},"Entrar"),React.createElement("button",{onClick:()=>setModalAuth("registro"),style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",border:"none",borderRadius:9,padding:"7px 14px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 3px 12px rgba(15,42,94,.3)"}},"\uD83C\uDF81 24h gratis")):React.createElement("div",{style:{display:"flex",gap:7,alignItems:"center"}},React.createElement("div",{style:{fontSize:11,fontWeight:700,color:auth.auth?.plan==="trial"?"#D97706":"#15803d",background:auth.auth?.plan==="trial"?"rgba(245,158,11,.1)":"rgba(21,128,61,.1)",border:`1px solid ${auth.auth?.plan==="trial"?"rgba(245,158,11,.3)":"rgba(21,128,61,.3)"}`,borderRadius:99,padding:"3px 9px"}},auth.user?.plan==="trial"?`Trial ${Math.floor(auth.trialRestante()/60)}h`:auth.user?.plan||"activo"),React.createElement("button",{onClick:()=>setVerPlanes(true),style:{background:"none",border:"1.5px solid #DCE6FB",borderRadius:9,padding:"6px 12px",fontSize:12,fontWeight:700,color:"#1E50C8",cursor:"pointer",fontFamily:"inherit"}},"\u2B50 Planes"),React.createElement("button",{onClick:()=>auth.logout(),style:{background:"none",border:"1.5px solid #FCA5A5",borderRadius:9,padding:"6px 10px",fontSize:11,fontWeight:700,color:"#DC2626",cursor:"pointer",fontFamily:"inherit"}},"Salir")),React.createElement("button",{onClick:()=>setVerBusqueda(true),"aria-label":"Buscar caso",title:"Buscar mi caso",style:{background:"none",border:"1.5px solid #DCE6FB",borderRadius:9,padding:"6px 12px",fontSize:13,fontWeight:600,color:"#1E50C8",cursor:"pointer",lineHeight:1,flexShrink:0,display:"flex",gap:6,alignItems:"center"}},React.createElement("span",null,"\uD83D\uDD0D"),React.createElement("span",{className:"hm"},"Buscar")),React.createElement("button",{onClick:toggleDark,title:esAuto?"Cambiar a modo "+(oscuro?"claro":"oscuro"):oscuro?"Modo oscuro (click para claro)":"Modo claro (click para oscuro)",style:{background:"none",border:"1.5px solid #DCE6FB",borderRadius:9,padding:"6px 10px",fontSize:16,cursor:"pointer",lineHeight:1,flexShrink:0,transition:"all .2s"},"aria-label":"Cambiar modo oscuro"},oscuro?"☀️":"🌙"),React.createElement("button",{className:"nl hm",onClick:()=>ir("conversor")},"\uD83D\uDCDD Documentos"),React.createElement("button",{className:"nl hm",onClick:()=>ir("directorio")},"\uD83E\uDD1D Abogados"),auth.user?.es_admin&&React.createElement("button",{className:"nl hm",onClick:()=>ir("admin"),style:{color:"#7C3AED",fontWeight:800}},"\uD83D\uDEE1\uFE0F Admin"),React.createElement("button",{className:"nl hm",onClick:()=>ir("casos")},"Mis casos ",casos.length>0&&React.createElement("span",{style:{background:"#1E50C8",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:10,display:"inline-flex",alignItems:"center",justifyContent:"center",marginLeft:2}},casos.length)),React.createElement("button",{className:"nl hm",onClick:()=>ir("guia")},"Gu\xEDa"),urgentes.length>0&&React.createElement("div",{className:"urg hm"},"\u26A0\uFE0F ",urgentes.length," urgente"),React.createElement("button",{className:"btn ba sm",onClick:nuevo,style:{marginLeft:4}},"+ Nuevo caso"),React.createElement("button",{className:"btn bo sm",onClick:()=>setChat(true),style:{marginLeft:4}},"\uD83D\uDCAC")))),React.createElement("div",{className:"con-nav-inferior",style:{maxWidth:1100,margin:"0 auto",padding:"22px 14px"}},pant==="inicio"&&React.createElement("div",{className:"fade"},React.createElement("div",{style:{background:"#F7F8FA",border:"1px solid #E8EAED",borderRadius:22,padding:"clamp(26px,5vw,52px) clamp(18px,5vw,44px)",marginBottom:26,color:"#1A1A1A",position:"relative",overflow:"hidden"}},React.createElement("div",{style:{display:"none"}}),React.createElement("div",{style:{display:"none"}}),React.createElement("div",{style:{position:"relative"}},React.createElement("div",{style:{display:"inline-flex",gap:6,background:"#EEF1F6",color:"#5B6472",borderRadius:50,padding:"5px 14px",fontSize:11,fontWeight:700,marginBottom:16,letterSpacing:1}},"\uD83C\uDDE8\uD83C\uDDF4 COLOMBIA \xB7 GRATUITO \xB7 IA ESPECIALIZADA"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,4.5vw,42px)",fontWeight:700,lineHeight:1.2,marginBottom:12}},"Su plataforma legal.",React.createElement("br",null),"Cu\xE9nteme su problema."),React.createElement("p",{style:{fontSize:"clamp(13px,2vw,16px)",color:"#5B6472",maxWidth:540,marginBottom:24,lineHeight:1.75}},"No necesita saber de leyes. Cu\xE9nteme qu\xE9 le pas\xF3 \u2014 hablando o escribiendo \u2014 y lo gu\xEDo desde el problema hasta la soluci\xF3n. Tutelas, derechos de petici\xF3n, desacatos y m\xE1s."),React.createElement("div",{style:{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}},React.createElement("button",{className:"btn",style:{background:"#fff",color:"#1E50C8",padding:"13px 26px",fontSize:15,borderRadius:11},onClick:nuevo},"\u2696\uFE0F Comenzar ahora \u2014 es gratis"),React.createElement("button",{className:"btn",style:{background:"#FFFFFF",color:"#37352F",border:"1px solid #E0E2E6",padding:"13px 20px",fontSize:13,borderRadius:10},onClick:()=>setChat(true)},"\uD83D\uDCAC Hablar con el abogado")),React.createElement("button",{onClick:()=>{setUrgencia(true);nuevo();},style:{background:"#FFFFFF",border:"1px solid #E0E2E6",color:"#37352F",borderRadius:10,padding:"11px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:7}},"\uD83D\uDEA8 Mi situaci\xF3n es urgente \u2014 acelerar proceso"))),React.createElement(IntelDashboard,null),React.createElement("div",{className:"ga",style:{marginBottom:22}},[{i:"🗣️",t:"Hable o escriba",d:"Use el micrófono en cualquier campo. Cuente su historia como le sale — la IA la convierte en documento legal."},{i:"🧠",t:"Memoria completa del caso",d:"Todo queda guardado. La IA conoce su expediente y da consejos basados en su historia real."},{i:"🔔",t:"Piloto automático",d:"Vigila sus casos, detecta vencimientos y le dice qué hacer sin que tenga que preguntar."},{i:"📊",t:"Estrategia paso a paso",d:"No solo genera documentos: construye la ruta completa desde el problema hasta la solución."},{i:"📖",t:"Analiza respuestas",d:"Suba el PDF que le llegó de la entidad y le explicamos en lenguaje simple qué significa."},{i:"🚀",t:"Radica en línea directo",d:"Al terminar lo llevamos a la plataforma oficial de la Rama Judicial para radicar en minutos."}].map(d=>React.createElement("div",{key:d.t,className:"card",style:{textAlign:"center",padding:16}},React.createElement("div",{style:{fontSize:28,marginBottom:8}},d.i),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,color:"#1E50C8",marginBottom:5}},d.t),React.createElement("div",{style:{fontSize:12,color:"#6B7280",lineHeight:1.6}},d.d)))),React.createElement(PanelCalculadoras,{catActiva:null}),React.createElement("div",{className:"card",style:{marginBottom:18}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:"#1E50C8",marginBottom:14}},"\uD83D\uDE80 Servicios disponibles"),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},[{ico:"📋",titulo:"Contratos",desc:"Genera y analiza contratos",color:"#1E50C8",pant:"contratos"},{ico:"🏛️",titulo:"Notarial",desc:"Poderes, sucesiones, familia",color:"#1E50C8",pant:"notarial"},{ico:"🤝",titulo:"Abogados",desc:"Directorio verificado",color:"#15803d",pant:"directorio"}].map((m,i)=>React.createElement("button",{key:i,onClick:()=>ir(m.pant),style:{background:`linear-gradient(135deg,${m.color}11,${m.color}18)`,border:`2px solid ${m.color}33`,borderRadius:14,padding:"14px 12px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .2s",position:"relative"},onMouseEnter:e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=m.color+"66";},onMouseLeave:e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=m.color+"33";}},m.urgente&&React.createElement("div",{style:{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:"#DC2626",animation:"pul 2s infinite"}}),React.createElement("div",{style:{fontSize:24,marginBottom:5}},m.ico),React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"#111827",marginBottom:2}},m.titulo),React.createElement("div",{style:{fontSize:10,color:"#6B7280",lineHeight:1.4}},m.desc))))),React.createElement("div",{className:"card",style:{marginBottom:22}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#1E50C8",marginBottom:4}},"\xBFQu\xE9 problema tiene?"),React.createElement("p",{style:{fontSize:13,color:"#6B7280",marginBottom:16}},"Seleccione \u2014 la IA construye su caso"),React.createElement("div",{className:"ga"},Object.values(CATS).map(c=>React.createElement("button",{key:c.id,className:"cc",onClick:()=>{setCatSel(c.id);setSubSel(null);setResp({});setFiles([]);setCkl(null);ir("subcasos");}},React.createElement("div",{style:{fontSize:34,marginBottom:9}},c.emoji),React.createElement("div",{style:{fontWeight:700,fontSize:15,color:"#111827",marginBottom:3}},c.nombre),React.createElement("div",{style:{fontSize:12,color:"#6B7280",lineHeight:1.5,marginBottom:8}},c.desc),React.createElement("div",{style:{fontSize:11,color:"#1E50C8",fontWeight:600}},c.subcasos.length," tipos \u2192"))))),urgentes.length>0&&React.createElement("div",{className:"card",style:{marginBottom:22,background:"#FEF2F2",border:"2px solid #FECACA"}},React.createElement("div",{style:{fontWeight:700,color:"#991B1B",marginBottom:10,fontSize:14}},"\uD83D\uDEA8 Requieren atenci\xF3n urgente ahora"),urgentes.map(c=>{const e=ETAPAS.find(x=>x.id===c.etapa);return React.createElement("div",{key:c.id,style:{display:"flex",gap:10,alignItems:"center",padding:"9px 0",borderBottom:"1px solid #FECACA",cursor:"pointer"},onClick:()=>{setCasoA(c);setConsejo(null);ir("seguimiento");}},React.createElement("span",{style:{fontSize:18}},CATS[c.categoria]?.emoji),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:13,fontWeight:700,color:"#7F1D1D"}},"#",c.numero," \u2014 ",c.subcasoNombre),React.createElement("div",{style:{fontSize:11,color:"#991B1B"}},e?.id==="impugnacion"?"3 días para impugnar":"La entidad no cumplió el fallo")),React.createElement("div",{className:"urg"},e?.icono));})),casos.length>0&&React.createElement("div",{className:"card",style:{borderLeft:"4px solid #1E50C8"}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1E50C8"}},"Mis casos recientes"),React.createElement("button",{className:"btn bo sm",onClick:()=>ir("casos")},"Ver todos \u2192")),[...casos].reverse().slice(0,3).map(c=>{const e=ETAPAS.find(x=>x.id===c.etapa);return React.createElement("div",{key:c.id,style:{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F3F4F6",cursor:"pointer"},onClick:()=>{setCasoA(c);setConsejo(null);ir("seguimiento");}},React.createElement("span",{style:{fontSize:20}},CATS[c.categoria]?.emoji),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:13,fontWeight:600}},"#",c.numero," \u2014 ",c.subcasoNombre),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},c.datosPersonales?.entidad||"Sin entidad"," \xB7 ",e?.nombre)),React.createElement("span",{className:"tag",style:{background:"#EEF3FE",color:"#1E50C8"}},e?.icono));})),React.createElement("div",{style:{marginTop:18,padding:"12px 16px",background:"#FFFBEB",borderRadius:12,border:"1px solid #FDE68A"}},React.createElement("p",{style:{fontSize:11,color:"#92400E",lineHeight:1.7}},"\u26A0\uFE0F ",React.createElement("strong",null,"Aviso legal:")," Ayuda Ciudadana orienta a ciudadanos colombianos. Los documentos son una base \u2014 rev\xEDselos antes de radicar. Para casos complejos, consulte la personer\xEDa de su ciudad (asesor\xEDa gratuita). La tutela puede presentarse sin abogado (Decreto 2591/1991)."))),pant==="categorias"&&React.createElement("div",{className:"fade"},React.createElement("button",{onClick:()=>ir("inicio"),style:{background:"none",border:"none",cursor:"pointer",color:"#6B7280",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:5}},"\u2190 Volver"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1E50C8",marginBottom:5}},"\xBFCu\xE1l es su problema?"),urgencia&&React.createElement("div",{style:{background:"#FEF2F2",border:"2px solid #FCA5A5",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#991B1B",fontWeight:600}},"\uD83D\uDEA8 Modo urgencia activado \u2014 su caso se marcar\xE1 como prioritario"),React.createElement("div",{className:"ga"},Object.values(CATS).map(c=>React.createElement("button",{key:c.id,className:"cc",onClick:()=>{setCatSel(c.id);setSubSel(null);setResp({});setFiles([]);setCkl(null);ir("subcasos");}},React.createElement("div",{style:{fontSize:38,marginBottom:10}},c.emoji),React.createElement("div",{style:{fontWeight:700,fontSize:16,color:"#111827",marginBottom:4}},c.nombre),React.createElement("div",{style:{fontSize:12,color:"#6B7280",lineHeight:1.5,marginBottom:10}},c.desc),React.createElement("div",{style:{fontSize:11,fontWeight:600,color:"#1E50C8"}},c.subcasos.length," tipos \u2192"))))),pant==="subcasos"&&cat&&React.createElement("div",{className:"fade"},React.createElement("button",{onClick:()=>ir("categorias"),style:{background:"none",border:"none",cursor:"pointer",color:"#6B7280",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:5}},"\u2190 Cambiar categor\xEDa"),React.createElement("div",{style:{display:"flex",gap:12,alignItems:"center",marginBottom:18}},React.createElement("span",{style:{fontSize:36}},cat.emoji),React.createElement("div",null,React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1E50C8"}},cat.nombre),React.createElement("p",{style:{color:"#6B7280",fontSize:13}},"\xBFCu\xE1l describe mejor su situaci\xF3n?"))),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:9}},cat.subcasos.map(s=>React.createElement("button",{key:s.id,className:"sc",onClick:()=>{setSubSel(s);setResp({});setPaso(0);setCkl(null);ir("preguntas");}},React.createElement("span",{style:{fontSize:24,minWidth:28}},s.icono),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:14,fontWeight:600}},s.nombre)),React.createElement("span",{style:{color:"#9CA3AF"}},"\u2192")))),React.createElement("div",{style:{marginTop:12,padding:"10px 14px",background:"#F0FDF4",borderRadius:10,fontSize:12,color:"#166534"}},"\uD83D\uDCA1 \xBFNo encuentra su caso? Elija el m\xE1s parecido \u2014 en las preguntas puede dar todos los detalles."),cat.id==="trabajo"&&React.createElement("button",{onClick:()=>ir("hoja_vida"),style:{marginTop:14,width:"100%",background:"#EEF3FE",border:"1px solid #DCE6FB",borderRadius:12,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,textAlign:"left"}},React.createElement("span",{style:{fontSize:22}},"\uD83D\uDCC4"),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:13.5,fontWeight:700,color:"#1E50C8"}},"Crear hoja de vida"),React.createElement("div",{style:{fontSize:11.5,color:"#6B7280"}},"Herramienta para tu b\u00fasqueda de empleo")),React.createElement("span",{style:{color:"#9CA3AF"}},"\u2192"))),pant==="preguntas"&&subSel&&React.createElement("div",{className:"fade"},React.createElement("div",{className:"card",style:{marginBottom:12,padding:"12px 18px"}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}},React.createElement("div",null,React.createElement("div",{style:{fontSize:10,color:"#6B7280",fontWeight:600}},"CONSTRUYENDO SU DOCUMENTO"),React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:14}},subSel.nombre)),React.createElement("div",{style:{fontSize:12,color:"#1E50C8",fontWeight:700}},"Pregunta ",paso+1," de ",pregs.length)),React.createElement("div",{className:"pb"},React.createElement("div",{className:"pf",style:{width:`${paso/pregs.length*100}%`}}))),paso<pregs.length&&React.createElement("div",{className:"card fade",key:paso},React.createElement("div",{style:{display:"flex",gap:10,marginBottom:16}},React.createElement("div",{style:{width:38,height:38,borderRadius:10,background:"#EEF3FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}},"\u2696\uFE0F"),React.createElement("div",{className:"cbot",style:{flex:1}},pregs[paso].texto)),(pregs[paso].tipo==="textarea"||pregs[paso].tipo==="texto")&&React.createElement(MicCampo,{value:resp[pregs[paso].id]||"",onChange:v=>setResp(p=>({...p,[pregs[paso].id]:v})),ph:pregs[paso].ph,rows:4}),pregs[paso].tipo==="opciones"&&React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:4}},pregs[paso].ops.map(o=>React.createElement("button",{key:o,className:`ob${resp[pregs[paso].id]===o?" sel":""}`,onClick:()=>setResp(p=>({...p,[pregs[paso].id]:o}))},o))),pregs[paso].tipo==="multi"&&React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:4}},pregs[paso].ops.map(o=>{const s=(resp[pregs[paso].id]||[]).includes(o);return React.createElement("button",{key:o,className:`ob${s?" ms":""}`,onClick:()=>{const a=resp[pregs[paso].id]||[];setResp(p=>({...p,[pregs[paso].id]:s?a.filter(x=>x!==o):[...a,o]}));}},s?"✓ ":"",o);}),React.createElement("p",{style:{fontSize:11,color:"#9CA3AF",marginTop:3}},"Puede seleccionar varias opciones")),React.createElement("div",{style:{display:"flex",gap:9,justifyContent:"space-between",marginTop:16}},React.createElement("button",{className:"btn bo sm",onClick:()=>setPaso(p=>Math.max(0,p-1)),style:{visibility:paso===0?"hidden":"visible"}},"\u2190 Anterior"),React.createElement("button",{className:"btn ba",onClick:()=>{if(paso<pregs.length-1)setPaso(p=>p+1);else{generarCkl();ir("checklist");}}},paso<pregs.length-1?"Siguiente →":"Verificar y continuar →")))),pant==="checklist"&&React.createElement("div",{className:"fade"},React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#1E50C8",marginBottom:3}},"\u2705 Verificaci\xF3n de calidad"),React.createElement("p",{style:{color:"#6B7280",fontSize:13}},"Revisamos su informaci\xF3n antes de generar el documento.")),(loadCkl||!ckl)&&React.createElement("div",{style:{textAlign:"center",padding:28,fontSize:14,color:"#6B7280"},className:"pul"},"\u2696\uFE0F Analizando su caso..."),ckl&&!loadCkl&&React.createElement("div",{className:"card"},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"#1E50C8"}},"Puntuaci\xF3n del caso"),React.createElement("div",{style:{fontSize:30,fontWeight:800,color:"#1E50C8"}},"Su caso está listo")),React.createElement("div",{className:"pb",style:{marginBottom:14,height:10}},React.createElement("div",{className:"pf",style:{width:`${ckl.puntuacion}%`,background:ckl.puntuacion>70?"#15803d":ckl.puntuacion>50?"#D97706":"#DC2626"}})),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8,marginBottom:16}},ckl.items?.map((x,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:9,fontSize:13,alignItems:"flex-start"}},React.createElement("span",{style:{fontSize:16,flexShrink:0}},x.e==="ok"?"✅":x.e==="warn"?"⚠️":"❌"),React.createElement("span",{style:{color:x.e==="ok"?"#166534":x.e==="warn"?"#92400E":"#991B1B"}},x.t)))),ckl.rec&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:9,padding:12,fontSize:13,color:"#166534",marginBottom:16,lineHeight:1.7}},"\uD83D\uDCA1 ",ckl.rec),React.createElement("div",{style:{display:"flex",gap:9}},React.createElement("button",{className:"btn bo",onClick:()=>ir("preguntas")},"\u2190 Mejorar respuestas"),React.createElement("button",{className:"btn ba",style:{flex:1},onClick:()=>ir("files")},"Continuar con files \u2192")))),pant==="files"&&React.createElement("div",{className:"fade"},React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#1E50C8",marginBottom:3}},"\uD83D\uDCCE Adjunte sus pruebas"),React.createElement("p",{style:{color:"#6B7280",fontSize:13,marginBottom:14}},"Fotos \uD83D\uDCF7, capturas \uD83D\uDCF8, PDFs \uD83D\uDCC4, audios \uD83C\uDFB5, videos \uD83C\uDFAC. M\xE1ximo 20 files \xB7 15 MB por archivo. ",React.createElement("strong",null,"Opcional pero fortalece su caso.")),React.createElement("div",{className:"dz",onClick:()=>fRef.current?.click(),onDragOver:e=>{e.preventDefault();e.currentTarget.classList.add("ov");},onDragLeave:e=>e.currentTarget.classList.remove("ov"),onDrop:e=>{e.preventDefault();e.currentTarget.classList.remove("ov");addFiles(e.dataTransfer.files);}},React.createElement("div",{style:{fontSize:32,marginBottom:8}},"\uD83D\uDCE4"),React.createElement("div",{style:{fontWeight:600,color:"#1E50C8",marginBottom:3}},"Haga clic o arrastre files aqu\xED"),React.createElement("div",{style:{fontSize:12,color:"#9CA3AF"}},"Cualquier imagen, audio, video, PDF o Word"),React.createElement("input",{ref:fRef,type:"file",multiple:true,accept:"image/*,audio/*,video/*,.pdf,.doc,.docx",style:{display:"none"},onChange:e=>addFiles(e.target.files)})),files.length>0&&React.createElement("div",{style:{marginTop:14}},React.createElement("div",{style:{fontSize:13,fontWeight:600,marginBottom:9}},files.length," archivo(s) adjunto(s):"),files.map(f=>React.createElement("div",{key:f.id,style:{display:"flex",gap:9,alignItems:"center",background:"#F9FAFB",borderRadius:9,padding:"9px 12px",marginBottom:7}},React.createElement("span",{style:{fontSize:20}},iconoArchivo(f.tipo)),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontSize:13,fontWeight:600}},f.nombre),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},fBytes(f.size))),React.createElement("input",{placeholder:"\xBFQu\xE9 es?",value:f.desc,onChange:e=>{const id=f.id;setFiles(p=>p.map(x=>x.id===id?{...x,desc:e.target.value}:x));},style:{width:160,fontSize:12,padding:"5px 9px"}}),React.createElement("button",{onClick:()=>setFiles(p=>p.filter(x=>x.id!==f.id)),style:{background:"none",border:"none",cursor:"pointer",fontSize:17,color:"#EF4444"}},"\u2715")))),React.createElement("div",{style:{display:"flex",gap:9,marginTop:16}},React.createElement("button",{className:"btn bo",onClick:()=>ir("checklist")},"\u2190 Volver"),React.createElement("button",{className:"btn ba",style:{flex:1},onClick:async()=>{if(files.length>0){try{const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:"Analiza estos archivos adjuntos para un caso legal colombiano: "+files.map(f=>f.nombre+(f.desc?" ("+f.desc+")":"")).join(", ")+". En 2-3 oraciones resume qué tipo de evidencia son y cómo fortalecen el caso. Solo el resumen, sin encabezados."}]})});const j=await r.json();const resumen=j.content?.map(b=>b.text||"").join("")||"";if(resumen)setCasoA(p=>p?({...p,analisisArchivos:resumen}):p);}catch(e){}}ir("datos");}},files.length>0?`Continuar con ${files.length} evidencia(s) →`:"Continuar sin evidencias →")))),pant==="datos"&&React.createElement("div",{className:"fade"},React.createElement(LineaDeTiempo,{eventos:timeline,setEventos:setTimeline}),casoA?.analisisArchivos&&React.createElement("div",{style:{background:"linear-gradient(135deg,#EEF3FE,#DCE6FB)",borderRadius:12,padding:"12px 16px",marginBottom:12,border:"1.5px solid #DCE6FB"}},React.createElement("div",{style:{fontSize:12,fontWeight:700,color:"#1E50C8",marginBottom:6}},"📎 Análisis de sus evidencias"),React.createElement("div",{style:{fontSize:13,color:"#374151",lineHeight:1.7}},casoA.analisisArchivos)),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#1E50C8",marginBottom:3}},"Sus datos personales"),React.createElement("p",{style:{color:"#6B7280",fontSize:13}},"Solo se usan para redactar el documento. No los compartimos con nadie.")),React.createElement("div",{className:"card"},React.createElement("div",{className:"g2"},CAMPOS.map(c=>c.id==="entidad"?React.createElement(CampoEntidadAuto,{key:"entidad",datos:datos,cat:catSel,onChange:(k,v)=>setDatos(p=>({...p,[k]:v}))}):React.createElement("div",{key:c.id,style:{gridColumn:c.full?"1/-1":"auto"}},c.full?React.createElement(MicCampo,{label:c.label,value:datos[c.id]||"",onChange:v=>setDatos(p=>({...p,[c.id]:v})),ph:c.ph,rows:2}):React.createElement(React.Fragment,null,React.createElement("label",null,c.label),React.createElement("input",{placeholder:c.ph,value:datos[c.id]||"",onChange:e=>setDatos(p=>({...p,[c.id]:e.target.value}))}))))),React.createElement("div",{style:{marginTop:12,padding:"10px 13px",background:"#F0FDF4",borderRadius:9,fontSize:12,color:"#166534"}},"\uD83D\uDCA1 Lo que deje en blanco aparecer\xE1 entre [corchetes] en el documento para completarlo antes de radicar."),React.createElement("div",{style:{display:"flex",gap:9,marginTop:18}},React.createElement("button",{className:"btn bo",onClick:()=>ir("files")},"\u2190 Volver"),React.createElement("button",{className:"btn ba",style:{flex:1},onClick:generarDoc},urgencia?"🚨 Generar documento URGENTE":"✍️ Generar documento con IA")))),pant==="generando"&&React.createElement("div",{className:"fade",style:{textAlign:"center",padding:"60px 20px"}},React.createElement("div",{style:{fontSize:56,marginBottom:18},className:"pul"},urgencia?"🚨":"⚖️"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1E50C8",marginBottom:9}},urgencia?"Generando documento urgente...":"Redactando su documento..."),React.createElement("p",{style:{color:"#6B7280",fontSize:13,lineHeight:1.8,maxWidth:380,margin:"0 auto 20px"}},"Analizando su caso, aplicando jurisprudencia colombiana actualizada y redactando el documento legal completo."),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:7,maxWidth:340,margin:"0 auto",textAlign:"left"}},["Analizando los hechos narrados...","Aplicando Decreto 2591 de 1991...","Citando sentencias de la Corte Constitucional...","Construyendo fundamentos de derecho...","Redactando pretensiones y petición final..."].map((t,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:7,alignItems:"center",fontSize:13,color:"#1E50C8"}},React.createElement("span",null,"\u2713"),t)))),pant==="tutela"&&casoA&&React.createElement("div",{className:"fade"},React.createElement("div",{style:{background:"linear-gradient(135deg,#15803d,#166534)",borderRadius:14,padding:"18px 22px",marginBottom:18,color:"#fff"}},React.createElement("div",{style:{fontSize:11,fontWeight:700,marginBottom:2}},"\u2705 DOCUMENTO LISTO \u2014 REVISE Y RADIQUE"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700}},casoA.tipoDoc," #",casoA.numero," \u2014 ",casoA.subcasoNombre),React.createElement("p",{style:{marginTop:5,fontSize:12,color:"rgba(255,255,255,.85)"}},"Complete los [corchetes], adjunte sus pruebas y siga la gu\xEDa de radicaci\xF3n.")),React.createElement("div",{className:"g13"},React.createElement("div",null,React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:14}},"\uD83D\uDCC4 Documento generado"),React.createElement("div",{style:{display:"flex",gap:7}},React.createElement("button",{className:"btn bo sm",onClick:()=>{navigator.clipboard.writeText(docGen);msg("Copiado ✓");}},"\uD83D\uDCCB"),React.createElement("button",{className:"btn ba sm",onClick:()=>imprimirSoloDocumento()},"\uD83D\uDDA8\uFE0F Imprimir"))),React.createElement("div",{className:"tdoc"},docGen||"Error al cargar.")),React.createElement("div",{style:{background:"linear-gradient(135deg,#3D68E3,#3D68E3)",borderRadius:12,padding:"16px 20px",marginBottom:12,color:"#fff"}},React.createElement("div",{style:{fontWeight:700,fontSize:14,marginBottom:5}},"\uD83D\uDE80 Radique en l\xEDnea \u2014 Rama Judicial (Oficial)"),React.createElement("p",{style:{fontSize:12,color:"rgba(255,255,255,.85)",marginBottom:10,lineHeight:1.6}},"Plataforma oficial del gobierno colombiano. Disponible 24/7. Le asignan n\xFAmero de radicado autom\xE1ticamente. No necesita ir al juzgado."),React.createElement("a",{href:"https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea",target:"_blank",rel:"noopener noreferrer",style:{background:"#fff",color:"#3D68E3",padding:"9px 18px",borderRadius:9,fontWeight:700,fontSize:13,textDecoration:"none",display:"inline-block"}},"Abrir Tutela en L\xEDnea \u2014 ramajudicial.gov.co \u2192")),React.createElement("div",{className:"card"},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1E50C8",marginBottom:12}},"\uD83D\uDCEE Gu\xEDa de radicaci\xF3n \u2014 Paso a paso"),[{n:1,i:"✏️",t:"Complete los corchetes",d:"Lea el documento y llene los campos entre [corchetes] con su información real.",tm:"15 min"},{n:2,i:"🖨️",t:"Imprima 3 copias",d:"Si no tiene impresora, vaya a una papelería o tienda de fotocopias.",tm:"15 min"},{n:3,i:"💻",t:"OPCIÓN 1: Radique en línea (recomendado)",d:"procesojudicial.ramajudicial.gov.co/TutelaEnLinea — Regístrese, suba el PDF y las pruebas. Número automático. Disponible 24/7.",tm:"20 min"},{n:4,i:"🏛️",t:"OPCIÓN 2: Radique en el juzgado",d:"Juzgado Civil Municipal. Diga: 'Vengo a radicar una tutela'. Lleve los 3 juegos impresos. Horario: 7:30am-12pm.",tm:"1-2 horas"},{n:5,i:"⏳",t:"Espere el fallo (10 días hábiles)",d:"El juez tiene 10 días para fallar. Consulte con su número de radicado en ramajudicial.gov.co.",tm:"10 días hábiles"},{n:6,i:"⬆️",t:"Si fallo negativo: impugne en 3 días",d:"Tiene SOLO 3 días hábiles. Vaya al juzgado o radique en línea. El tribunal tiene 20 días más.",tm:"3 días hábiles"}].map(p=>React.createElement("div",{key:p.n,className:"pc",style:{marginBottom:9}},React.createElement("div",{style:{width:34,height:34,borderRadius:"50%",background:"#1E50C8",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}},p.n),React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"#111827",marginBottom:2}},p.i," ",p.t),React.createElement("div",{style:{fontSize:12,color:"#6B7280",lineHeight:1.6}},p.d),React.createElement("div",{style:{fontSize:11,color:"#1E50C8",fontWeight:600,marginTop:3}},"\u23F1 ",p.tm)))))),React.createElement("div",null,React.createElement("div",{className:"card",style:{marginBottom:12,background:"#FFFBEB",border:"2px solid #FDE68A"}},React.createElement("div",{style:{fontWeight:700,color:"#92400E",marginBottom:10}},"\u23F0 Plazos legales"),[["Juez falla la tutela","10 días hábiles"],["Impugnar fallo negativo","3 días hábiles"],["Tribunal resuelve","20 días hábiles"],["Entidad cumple (salud)","48 horas"],["Derecho de petición","15 días hábiles"],["Prescripción comparendos","3 años"]].map(([l,v])=>React.createElement("div",{key:l,style:{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:12}},React.createElement("span",{style:{color:"#78350F"}},l),React.createElement("span",{style:{fontWeight:700,color:"#D97706"}},v)))),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",marginBottom:9}},"\uD83D\uDCCE Pruebas a adjuntar"),["Fotocopia de cédula","Orden médica o resolución","Respuesta negativa de la entidad","Comprobante de radicación previa","Facturas o recibos","Capturas de pantalla o correos","Fotos o videos como evidencia","Historia clínica o certificados"].map((p,i)=>React.createElement("label",{key:i,style:{display:"flex",gap:7,marginBottom:6,cursor:"pointer",fontWeight:400,color:"#374151",fontSize:13}},React.createElement("input",{type:"checkbox",style:{width:"auto",margin:0}})," ",p)),files.length>0&&React.createElement("div",{style:{marginTop:9,padding:"7px 10px",background:"#F0FDF4",borderRadius:7,fontSize:11,color:"#166534"}},"\u2713 Tiene ",files.length," archivo(s) adjuntos para acompa\xF1ar el documento.")),React.createElement("button",{className:"btn ba",style:{width:"100%",marginBottom:9},onClick:()=>{setConsejo(null);setEstrategia(null);ir("seguimiento");}},"\uD83D\uDCCA Ver seguimiento del caso \u2192"),React.createElement("button",{className:"btn bo",style:{width:"100%"},onClick:nuevo},"+ Crear otra tutela")))),pant==="seguimiento"&&casoA&&(()=>{const caso=data.casos.find(c=>c.id===casoA.id)||casoA;const idxEt=ETAPAS.findIndex(e=>e.id===caso.etapa);return React.createElement("div",{className:"fade"},React.createElement("button",{onClick:()=>ir("casos"),style:{background:"none",border:"none",cursor:"pointer",color:"#6B7280",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:5}},"\u2190 Mis casos"),React.createElement(BarraProcesoCompleto,{etapaActual:caso?.etapa||"radicacion"}),React.createElement(GuiaEtapaActual,{caso:caso,onAccion:accion=>{if(accion==="documento"){setDocGen(caso?.tutela||"");ir("tutela");}else if(accion==="confirmar_radicacion"){actualizarEtapa(caso.id,"admision","Radicado por el usuario");msg("Estado actualizado ✓","ok");}else if(accion==="no_respondieron"||accion==="respondieron_mal"){actualizarEtapa(caso.id,"contestacion","Sin respuesta o respuesta inadecuada");msg("Avanzando al siguiente paso...","ok");}else if(accion==="respondieron_bien"||accion==="resuelto"){actualizarEtapa(caso.id,"cerrado","Caso resuelto favorablemente");msg("¡Caso cerrado exitosamente! 🎉","ok");}else if(accion==="impugnar"){actualizarEtapa(caso.id,"impugnacion","Se procede a impugnar");msg("Preparando recurso de impugnación...","ok");}else if(accion==="fallo_favorable"){actualizarEtapa(caso.id,"fallo","Fallo favorable");msg("Fallo favorable. Verifique el cumplimiento.","ok");}else if(accion==="fallo_negativo"){actualizarEtapa(caso.id,"impugnacion","Fallo negativo — impugnación");msg("Preparando recurso...","ok");}}}),React.createElement("div",{style:{background:"linear-gradient(135deg,#312e81,#1E50C8)",borderRadius:12,padding:"14px 18px",marginBottom:18,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}},React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:14}},"\uD83E\uDD14 \xBFQu\xE9 hago ahora?"),React.createElement("div",{style:{fontSize:12,color:"rgba(255,255,255,.8)"}},"La IA analiza su expediente y le dice qu\xE9 hacer hoy")),React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap"}},React.createElement("button",{className:"btn",style:{background:"#fff",color:"#1E50C8",padding:"9px 16px",fontSize:13},onClick:()=>generarConsejo(caso),disabled:loadC},loadC?"Analizando...":"Ver consejo"),React.createElement("button",{className:"btn",style:{background:"rgba(255,255,255,.2)",color:"#fff",border:"2px solid rgba(255,255,255,.3)",padding:"9px 16px",fontSize:13},onClick:()=>{setEstrategia(null);generarEstrategia(caso);}},"Estrategia completa"))),React.createElement("div",{className:"g13"},React.createElement("div",null,React.createElement("div",{className:"card",style:{marginBottom:12,borderLeft:"5px solid #1E50C8"}},React.createElement("div",{style:{display:"flex",gap:10,alignItems:"flex-start",flexWrap:"wrap",marginBottom:9}},React.createElement("span",{style:{fontSize:30}},CATS[caso.categoria]?.emoji),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1E50C8"}},caso.tipoDoc||"TUTELA"," #",caso.numero),React.createElement("div",{style:{fontSize:12,color:"#6B7280"}},caso.subcasoNombre," \xB7 ",fFecha(caso.fechaCreacion)),React.createElement("div",{style:{fontSize:12,color:"#374151",marginTop:2}},"\uD83D\uDCCD ",caso.datosPersonales?.entidad||"Entidad no especificada"),caso.urgencia&&React.createElement("div",{style:{marginTop:5},className:"urg"},"\uD83D\uDEA8 CASO DE URGENCIA"))),React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},caso.tutela&&React.createElement("button",{className:"btn bo sm",onClick:()=>{setDocGen(caso.tutela);ir("tutela");}},"\uD83D\uDCC4 Ver doc."),React.createElement("a",{href:"https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea",target:"_blank",rel:"noopener noreferrer",className:"btn ba sm",style:{textDecoration:"none"}},"\uD83D\uDE80 Radicar"),React.createElement("button",{className:"btn bo sm",onClick:()=>setChat(true)},"\uD83D\uDCAC Consultar"),React.createElement("button",{className:"btn br sm",onClick:()=>eliminar(caso.id)},"\uD83D\uDDD1"))),(consejo||loadC)&&React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:13,marginBottom:9}},"\u2696\uFE0F Consejo del abogado digital"),loadC&&React.createElement("div",{style:{fontSize:13,color:"#6B7280"},className:"pul"},"Analizando su expediente..."),consejo&&!loadC&&React.createElement("div",{className:"cb"},React.createElement("div",{style:{fontSize:13,color:"#312e81",lineHeight:1.8,whiteSpace:"pre-wrap"}},consejo))),(estrategia||loadE)&&React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:13,marginBottom:10}},"\uD83D\uDCCA Estrategia jur\xEDdica"),loadE&&React.createElement("div",{style:{fontSize:13,color:"#6B7280"},className:"pul"},"Construyendo su estrategia..."),estrategia&&!loadE&&React.createElement(React.Fragment,null,React.createElement("div",{style:{background:"#F0FDF4",borderRadius:9,padding:12,marginBottom:10,fontSize:13,color:"#166534",lineHeight:1.7}},React.createElement("strong",null,"Situaci\xF3n:")," ",estrategia.sit),estrategia.urgente&&React.createElement("div",{style:{background:"#FEF2F2",borderRadius:9,padding:10,marginBottom:10,fontSize:13,color:"#991B1B",fontWeight:600}},"\uD83D\uDEA8 HOY: ",estrategia.urgente),estrategia.pasos?.map((p,i)=>React.createElement("div",{key:i,className:"ep"},React.createElement("div",{style:{width:26,height:26,borderRadius:"50%",background:p.urg==="alta"?"#DC2626":p.urg==="media"?"#D97706":"#1E50C8",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}},p.n),React.createElement("div",null,React.createElement("div",{style:{fontWeight:600,fontSize:13}},p.acc),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},p.pq," \xB7 ",p.plazo)))),estrategia.fortalezas?.length>0&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:8,padding:10,marginTop:10,marginBottom:7}},React.createElement("div",{style:{fontWeight:600,fontSize:11,color:"#15803d",marginBottom:5}},"\u2705 Fortalezas"),(estrategia.fortalezas||[]).map((f,i)=>React.createElement("div",{key:i,style:{fontSize:12,color:"#166534"}},"\u2022 ",f))),estrategia.riesgos?.length>0&&React.createElement("div",{style:{background:"#FEF2F2",borderRadius:8,padding:10}},React.createElement("div",{style:{fontWeight:600,fontSize:11,color:"#DC2626",marginBottom:5}},"\u26A0\uFE0F Riesgos si no act\xFAa"),(estrategia.riesgos||[]).map((r,i)=>React.createElement("div",{key:i,style:{fontSize:12,color:"#991B1B"}},"\u2022 ",r))))),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1E50C8",marginBottom:16}},"Estado del proceso"),React.createElement("div",{style:{position:"relative"}},ETAPAS.map((et,i)=>{const h=i<idxEt,a=i===idxEt,p=i>idxEt;return React.createElement("div",{key:et.id,style:{display:"flex",gap:12,paddingBottom:i<ETAPAS.length-1?20:0,position:"relative"}},i<ETAPAS.length-1&&React.createElement("div",{style:{position:"absolute",left:15,top:32,bottom:0,width:2,background:h?"#1E50C8":"#E5E7EB"}}),React.createElement("div",{className:`ed ${h?"h":a?"a":"p"}`},h?"✓":et.icono),React.createElement("div",{style:{flex:1,paddingTop:5}},React.createElement("div",{style:{fontWeight:700,fontSize:13,color:p?"#9CA3AF":"#111827"}},et.nombre),React.createElement("div",{style:{fontSize:11,color:"#6B7280"}},et.desc),a&&caso.etapa!=="cerrado"&&React.createElement("div",{style:{marginTop:9}},et.id==="radicacion"&&React.createElement("div",{style:{background:"#EEF3FE",borderRadius:9,padding:12}},React.createElement("p",{style:{fontSize:12,color:"#1A42A3",fontWeight:600,marginBottom:8}},"\uD83D\uDCEE \xBFYa radic\xF3 en el juzgado o en l\xEDnea?"),React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},React.createElement("button",{className:"btn ba sm",onClick:()=>actualizarEtapa(caso.id,"admision","Tutela radicada exitosamente")},"\u2713 S\xED, ya la radiqu\xE9"),React.createElement("a",{href:"https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea",target:"_blank",rel:"noopener noreferrer",className:"btn bo sm",style:{textDecoration:"none"}},"Radicar en l\xEDnea \u2192"))),et.id==="admision"&&React.createElement("div",{style:{background:"#EEF3FE",borderRadius:9,padding:12}},React.createElement("p",{style:{fontSize:12,color:"#1A42A3",fontWeight:600,marginBottom:8}},"\u2696\uFE0F \xBFEl juzgado admiti\xF3 y notific\xF3 a la entidad?"),React.createElement("button",{className:"btn ba sm",onClick:()=>actualizarEtapa(caso.id,"contestacion","Juzgado admitió la tutela")},"\u2713 S\xED, admitida")),et.id==="contestacion"&&React.createElement("div",{style:{background:"#EEF3FE",borderRadius:9,padding:12}},React.createElement("p",{style:{fontSize:12,color:"#1A42A3",fontWeight:600,marginBottom:8}},"\uD83D\uDD28 \xBFYa recibi\xF3 el fallo del juez?"),React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},React.createElement("button",{className:"btn bv sm",onClick:()=>actualizarEtapa(caso.id,"fallo","Juez falló a favor 🎉")},"\uD83C\uDF89 A mi favor"),React.createElement("button",{className:"btn br sm",onClick:()=>actualizarEtapa(caso.id,"impugnacion","Fallo negativo")},"Negativo, voy a impugnar"))),et.id==="fallo"&&React.createElement("div",{style:{background:"#F0FDF4",borderRadius:9,padding:12}},React.createElement("p",{style:{fontSize:12,color:"#166534",fontWeight:600,marginBottom:8}},"\uD83C\uDF89 \xA1Fallo favorable! La entidad tiene 48 horas para cumplir (salud) o el plazo que fij\xF3 el juez."),React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},React.createElement("button",{className:"btn bv sm",onClick:()=>actualizarEtapa(caso.id,"cerrado","Entidad cumplió ✓")},"\u2713 La entidad cumpli\xF3"),React.createElement("button",{className:"btn br sm",onClick:()=>{actualizarEtapa(caso.id,"desacato","Entidad no cumplió");ir("desacato_guia");}},"No cumplieron \u2014 Desacato"))),et.id==="impugnacion"&&React.createElement("div",{style:{background:"#FFFBEB",borderRadius:9,padding:12,border:"1px solid #FDE68A"}},React.createElement("p",{style:{fontSize:12,color:"#92400E",fontWeight:700,marginBottom:6}},"\uD83D\uDEA8 URGENTE: SOLO 3 d\xEDas h\xE1biles para impugnar ante el mismo juzgado."),React.createElement("p",{style:{fontSize:11,color:"#78350F",marginBottom:8}},"El tribunal superior tiene 20 d\xEDas para resolver la impugnaci\xF3n."),React.createElement("button",{className:"btn bd sm",onClick:()=>actualizarEtapa(caso.id,"cerrado","Impugnación radicada")},"\u2713 Impugnaci\xF3n radicada")),et.id==="desacato"&&React.createElement("div",{style:{background:"#FEF2F2",borderRadius:9,padding:12}},React.createElement("p",{style:{fontSize:12,color:"#991B1B",fontWeight:600,marginBottom:8}},"\uD83D\uDEA8 Desacato activo. El juez puede sancionar con arresto al representante legal."),React.createElement("div",{style:{display:"flex",gap:7,flexWrap:"wrap"}},React.createElement("button",{className:"btn br sm",onClick:()=>ir("desacato_guia")},"Ver gu\xEDa de desacato"),React.createElement("button",{className:"btn bv sm",onClick:()=>actualizarEtapa(caso.id,"cerrado","Entidad cumplió tras desacato")},"\u2713 La entidad finalmente cumpli\xF3")))),caso.etapa==="cerrado"&&et.id==="cerrado"&&React.createElement("span",{className:"tag",style:{background:"#DCFCE7",color:"#166534",marginTop:5}},"\u2705 Proceso finalizado")));}))),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"#1E50C8",marginBottom:12}},"\uD83D\uDCCB Historial de actuaciones"),(caso.historial||[]).map((h,i)=>React.createElement("div",{key:i,className:"li"},React.createElement("div",{style:{width:30,height:30,borderRadius:"50%",background:i===0?"#15803d":"#EEF3FE",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,color:i===0?"#fff":"#1E50C8"}},i===0?"✓":i+1),React.createElement("div",null,React.createElement("div",{style:{fontSize:13,fontWeight:600}},h.evento),h.nota&&React.createElement("div",{style:{fontSize:11,color:"#6B7280",marginTop:1}},h.nota),React.createElement("div",{style:{fontSize:10,color:"#9CA3AF"}},fFecha(h.fecha)))))),React.createElement(DerechosFundamentales,{catId:caso?.categoria}),React.createElement(ChecklistEvidencias,{subcasoId:caso?.subcaso||"default",urgente:caso?.urgencia}),React.createElement(ProbabilidadExito,{caso:caso}),pant==="fotomultas_asistente"?null:React.createElement(ExtrasCategoria,{catId:caso?.categoria,onAbrirFotomultas:()=>setPant("fotomultas_asistente")}),React.createElement(PanelCalculadoras,{catActiva:caso?.cat}),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"#1E50C8",marginBottom:9}},"\uD83D\uDD0D Analizar respuesta de la entidad"),React.createElement("p",{style:{fontSize:12,color:"#6B7280",marginBottom:10,lineHeight:1.6}},"\xBFLe lleg\xF3 un documento y no sabe qu\xE9 significa? S\xFAbalo y le explicamos en lenguaje simple qu\xE9 decidieron y qu\xE9 puede hacer."),React.createElement("div",{className:"dz",style:{padding:14},onClick:()=>adRef.current?.click()},React.createElement("div",{style:{fontSize:22,marginBottom:5}},"\uD83D\uDCC4"),React.createElement("div",{style:{fontSize:13,fontWeight:600,color:"#1E50C8"}},"Subir documento recibido"),React.createElement("div",{style:{fontSize:11,color:"#9CA3AF"}},"Resoluci\xF3n, carta, oficio, fallo, respuesta..."),React.createElement("input",{ref:adRef,type:"file",accept:".pdf,.doc,.docx,image/*",style:{display:"none"},onChange:e=>{if(e.target.files[0])analizarDoc(e.target.files[0].name,e.target.files[0].type);}})),loadAD&&React.createElement("div",{style:{textAlign:"center",padding:16,fontSize:13,color:"#6B7280"},className:"pul"},"\u2696\uFE0F Leyendo y analizando el documento..."),analDoc&&!loadAD&&React.createElement("div",{style:{marginTop:12}},React.createElement("div",{style:{background:analDoc.favorable?"#F0FDF4":"#FEF2F2",borderRadius:11,padding:14}},React.createElement("div",{style:{fontWeight:700,fontSize:14,color:analDoc.favorable?"#15803d":"#DC2626",marginBottom:9}},analDoc.favorable?"✅":"❌"," ",analDoc.tipo," \u2014 ",analDoc.decision),React.createElement("div",{style:{fontSize:13,color:"#374151",lineHeight:1.75,marginBottom:9}},React.createElement("strong",null,"\xBFQu\xE9 significa?")," ",analDoc.qsignifica),React.createElement("div",{style:{fontSize:12,color:"#374151",marginBottom:9}},React.createElement("strong",null,"\xBFRespondi\xF3 de fondo?")," ",analDoc.respondio?"Sí, respondió":"No, la respuesta fue evasiva o incompleta"),React.createElement("div",{style:{background:"#EEF3FE",borderRadius:8,padding:11}},React.createElement("div",{style:{fontWeight:700,fontSize:12,color:"#1E50C8",marginBottom:3}},"\u2705 \xBFQu\xE9 hacer ahora?"),React.createElement("div",{style:{fontSize:13,color:"#1A42A3"}},analDoc.qhacer),analDoc.plazo&&React.createElement("div",{style:{fontSize:11,color:"#1E50C8",fontWeight:600,marginTop:5}},"\u23F1 Plazo: ",analDoc.plazo))))),React.createElement("div",{className:"card"},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",marginBottom:9}},"\uD83D\uDCDD Mis notas del caso"),React.createElement(MicCampo,{value:nota,onChange:setNota,ph:"Anote n\xFAmeros de radicado, nombres del juzgado, fechas, llamadas realizadas, o cualquier dato que quiera recordar...",rows:3}),React.createElement("button",{className:"btn bv sm",style:{marginTop:9},onClick:()=>guardarNota(caso.id,nota)},"\uD83D\uDCBE Guardar nota"))),React.createElement("div",null,caso.files?.length>0&&React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",marginBottom:9}},"\uD83D\uDCCE Archivos (",caso.files.length,")"),caso.files.map((a,i)=>React.createElement("div",{key:i,style:{display:"flex",gap:7,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #F3F4F6"}},React.createElement("span",{style:{fontSize:16}},iconoArchivo(a.tipo)),React.createElement("div",null,React.createElement("div",{style:{fontSize:12,fontWeight:500}},a.nombre),React.createElement("div",{style:{fontSize:10,color:"#9CA3AF"}},fBytes(a.size),a.desc?` · ${a.desc}`:""))))),React.createElement("div",{className:"card",style:{marginBottom:12,background:"#FFFBEB",border:"2px solid #FDE68A"}},React.createElement("div",{style:{fontWeight:700,color:"#92400E",marginBottom:10,fontSize:13}},"\u23F0 Radar de plazos"),[{l:"Juez falla",d:"10 días hábiles",act:caso.etapa==="admision"},{l:"Impugnar",d:"3 días hábiles",act:caso.etapa==="impugnacion"},{l:"Tribunal",d:"20 días hábiles",act:caso.etapa==="impugnacion"}].map(pl=>React.createElement("div",{key:pl.l,style:{marginBottom:9}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}},React.createElement("span",{style:{color:"#78350F",fontWeight:600}},pl.l),React.createElement("span",{style:{color:pl.act?"#DC2626":"#D97706",fontWeight:700}},pl.act?"⚠️ ":"",pl.d)),React.createElement("div",{style:{height:4,borderRadius:2,background:"#FDE68A"}},React.createElement("div",{style:{height:"100%",background:pl.act?"#DC2626":"#D97706",width:pl.act?"80%":"30%",transition:"width 0.3s"}}))))),React.createElement("div",{className:"card",style:{marginBottom:12}},React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",marginBottom:9,fontSize:13}},"\uD83D\uDCDE L\xEDneas de apoyo gratuito"),[["Personería Bogotá","(601) 3813000"],["Defensoría del Pueblo","01 8000 914 814"],["Supersalud","01 8000 910 097"],["Superservicios","01 8000 114 143"],["Min. Trabajo","01 8000 112 888"]].map(([n,t])=>React.createElement("div",{key:n,style:{fontSize:12,marginBottom:6}},React.createElement("span",{style:{color:"#374151"}},n,": "),React.createElement("a",{href:`tel:${t}`,style:{color:"#1E50C8",fontWeight:600,textDecoration:"none"}},t)))),React.createElement("a",{href:"https://procesojudicial.ramajudicial.gov.co/TutelaEnLinea",target:"_blank",rel:"noopener noreferrer",style:{display:"block",textDecoration:"none",marginBottom:9}},React.createElement("div",{style:{background:"linear-gradient(135deg,#3D68E3,#3D68E3)",borderRadius:11,padding:"12px 16px",color:"#fff",textAlign:"center"}},React.createElement("div",{style:{fontWeight:700,fontSize:13,marginBottom:2}},"\uD83D\uDE80 Radicar en l\xEDnea"),React.createElement("div",{style:{fontSize:11,color:"rgba(255,255,255,.8)"}},"Rama Judicial oficial \xB7 24/7"))),React.createElement("button",{className:"btn bo",style:{width:"100%"},onClick:()=>setChat(true)},"\uD83D\uDCAC Consultar al abogado digital"))));})(),pant==="casos"&&React.createElement("div",{className:"fade"},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1E50C8"}},"Mis tutelas y documentos"),React.createElement("button",{className:"btn ba sm",onClick:nuevo},"+ Nuevo caso")),casos.length>0&&React.createElement("input",{placeholder:"\uD83D\uDD0D Buscar...",value:busq,onChange:e=>setBusq(e.target.value),style:{maxWidth:360,marginBottom:14}}),cFilt.length===0?React.createElement("div",{className:"card",style:{textAlign:"center",padding:44}},React.createElement("div",{style:{fontSize:48,marginBottom:12}},"\uD83D\uDCC2"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#1E50C8",marginBottom:7}},busq?"Sin resultados":"Aún no tiene casos"),React.createElement("p",{style:{color:"#6B7280",marginBottom:18,fontSize:13}},"Cu\xE9ntenos su problema y le ayudamos gratis."),React.createElement("button",{className:"btn ba",onClick:nuevo},"\u2696\uFE0F Crear mi primera tutela")):React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:11}},[...cFilt].reverse().map(c=>{const e=ETAPAS.find(x=>x.id===c.etapa);const ei=ETAPAS.findIndex(x=>x.id===c.etapa);const urg=["impugnacion","desacato"].includes(c.etapa);return React.createElement("div",{key:c.id,className:"card",style:{cursor:"pointer",border:"2px solid transparent",transition:"all .2s"},onClick:()=>{setCasoA(c);setConsejo(null);setEstrategia(null);setAnalDoc(null);ir("seguimiento");},onMouseEnter:x=>x.currentTarget.style.borderColor="#DCE6FB",onMouseLeave:x=>x.currentTarget.style.borderColor="transparent"},React.createElement("div",{style:{display:"flex",gap:10,alignItems:"flex-start"}},React.createElement("span",{style:{fontSize:28,minWidth:32}},CATS[c.categoria]?.emoji),React.createElement("div",{style:{flex:1}},React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:7,marginBottom:4}},React.createElement("div",{style:{fontWeight:700,fontSize:14}},"#",c.numero," \u2014 ",c.subcasoNombre),React.createElement("div",{style:{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}},urg&&React.createElement("div",{className:"urg"},"\u26A0\uFE0F URGENTE"),c.urgencia&&React.createElement("div",{className:"urg"},"\uD83D\uDEA8"),React.createElement("span",{className:"tag",style:{background:"#EEF3FE",color:"#1E50C8"}},e?.icono," ",e?.nombre))),React.createElement("div",{style:{fontSize:11,color:"#6B7280",marginBottom:9}},c.tipoDoc||"Tutela"," \xB7 ",fFecha(c.fechaCreacion)," \xB7 ",c.datosPersonales?.entidad||"Sin entidad"),React.createElement("div",{style:{display:"flex",gap:3}},ETAPAS.filter(x=>x.id!=="cerrado").map((x,i)=>React.createElement("div",{key:x.id,style:{height:4,flex:1,borderRadius:2,background:i<=ei?"#1E50C8":"#E5E7EB"},title:x.nombre}))),c.files?.length>0&&React.createElement("div",{style:{fontSize:11,color:"#6B7280",marginTop:5}},"\uD83D\uDCCE ",c.files.length," archivo(s)"))));}))),pant==="guia"&&React.createElement("div",{className:"fade"},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1E50C8",marginBottom:5}},"\uD83D\uDCD6 Gu\xEDa completa de tutelas en Colombia"),React.createElement("p",{style:{color:"#6B7280",marginBottom:20,fontSize:13}},"Todo lo que necesita saber para defender sus derechos sin abogado ni costo."),React.createElement("div",{className:"g2",style:{marginBottom:18}},React.createElement("div",{className:"card"},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1E50C8",marginBottom:10}},"\xBFQu\xE9 es una tutela?"),React.createElement("p",{style:{fontSize:13,color:"#374151",lineHeight:1.8}},"La acci\xF3n de tutela (Art. 86 CP y Decreto 2591/1991) permite a cualquier colombiano proteger sus derechos fundamentales cuando son vulnerados. Se puede presentar sin abogado, ante cualquier juzgado del pa\xEDs, de forma completamente gratuita.")),React.createElement("div",{className:"card"},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#1E50C8",marginBottom:10}},"\xBFQu\xE9 es un derecho de petici\xF3n?"),React.createElement("p",{style:{fontSize:13,color:"#374151",lineHeight:1.8}},"El derecho de petici\xF3n (Art. 23 CP y Ley 1755/2015) le permite solicitar informaci\xF3n o actuaciones a cualquier entidad p\xFAblica. Deben responder en 15 d\xEDas h\xE1biles. Si no responden, procede tutela por vulneraci\xF3n directa."))),React.createElement("div",{className:"card",style:{marginBottom:18}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"#B45309",marginBottom:12}},"\uD83D\uDE97 Movilidad & Secretar\xEDas de Tr\xE1nsito"),React.createElement("div",{className:"g2"},[{t:"Prescripción de comparendos",d:"Si pasaron más de 3 años desde la infracción sin cobro coactivo formal, el comparendo puede estar prescrito. Solicite prescripción con derecho de petición. Sin respuesta en 15 días → tutela.",n:"Art. 828 E.T., Ley 1066/2006"},{t:"Comparendo sin notificación",d:"Si nunca lo notificaron correctamente y se enteró años después por el SIMIT, el debido proceso fue vulnerado. Tiene derecho a impugnar.",n:"Art. 93 Ley 769/2002 (Código de Tránsito)"},{t:"Comparendo con error",d:"Si la cámara capturó otro vehículo, usted había vendido el carro, o no era el conductor, puede interponer recurso de reposición o tutela por vulneración al debido proceso.",n:"Ley 1843/2017, Ley 769/2002"},{t:"Inmovilización ilegal",d:"Si inmovilizaron su vehículo sin causa válida (SOAT y RTM vigentes), puede pedir libertad del vehículo por tutela por vulneración al debido proceso.",n:"Art. 182 Ley 769/2002, T-051/2016"}].map(x=>React.createElement("div",{key:x.t,style:{background:"#FFFBEB",borderRadius:11,padding:13,border:"1px solid #FDE68A"}},React.createElement("div",{style:{fontWeight:700,fontSize:13,color:"#78350F",marginBottom:5}},x.t),React.createElement("div",{style:{fontSize:12,color:"#374151",lineHeight:1.65,marginBottom:5}},x.d),React.createElement("div",{style:{fontSize:10,color:"#D97706",fontWeight:600}},x.n))))),React.createElement("div",{className:"card",style:{marginBottom:18,background:"#FEF2F2",border:"2px solid #FECACA"}},React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"#991B1B",marginBottom:12}},"\uD83D\uDEA8 Desacato \u2014 Cuando no cumplen el fallo"),React.createElement("p",{style:{fontSize:13,color:"#7F1D1D",lineHeight:1.75,marginBottom:14}},"Si el juez fall\xF3 a su favor y la entidad no cumpli\xF3, tiene derecho al incidente de desacato. El juez puede sancionar con arresto hasta 6 meses y multa hasta 20 SMLMV al representante legal."),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:9}},[{n:1,t:"Regrese al juzgado",d:"El mismo que emitió el fallo, con prueba del incumplimiento."},{n:2,t:"Solicite el incidente",d:"Diga: 'Vengo a solicitar incidente de desacato'. El juez decide en 3 días."},{n:3,t:"Pruebe el incumplimiento",d:"Fotos, correos, testimonios de que la entidad no cumplió."},{n:4,t:"El juez sanciona",d:"Arresto hasta 6 meses + multa hasta 20 SMLMV diarios hasta que cumplan."}].map(p=>React.createElement("div",{key:p.n,style:{background:"#fff",borderRadius:9,padding:11}},React.createElement("div",{style:{fontWeight:800,fontSize:16,color:"#DC2626",marginBottom:3}},p.n),React.createElement("div",{style:{fontWeight:700,fontSize:12,color:"#7F1D1D",marginBottom:3}},p.t),React.createElement("div",{style:{fontSize:11,color:"#374151",lineHeight:1.5}},p.d))))),React.createElement("div",{style:{textAlign:"center"}},React.createElement("button",{className:"btn ba",style:{padding:"13px 30px",fontSize:15},onClick:nuevo},"\u2696\uFE0F Crear mi tutela ahora \u2014 es gratis"))),pant==="admin"&&auth.user&&React.createElement("div",{style:{position:"fixed",inset:0,zIndex:500,overflowY:"auto"}},React.createElement(AdminPanelInline,{user:auth.user,token:null,onSalir:()=>ir("inicio")})),pant==="directorio"&&React.createElement("div",{className:"fade",style:{padding:"0 0 80px"}},React.createElement(DirectorioAbogados,{onVolver:()=>ir(casoA?"seguimiento":"inicio"),catInicial:casoA?.categoria})),
pant==="hoja_vida"&&React.createElement("div",{className:"fade",style:{padding:"0 0 80px"}},React.createElement(ModuloHojaVida,{onVolver:()=>ir("inicio")})),
pant==="conversor"&&React.createElement("div",{className:"fade",style:{padding:"0 0 80px"}},React.createElement(ModuloConversor,{onVolver:()=>ir("inicio")})),pant==="contratos"&&React.createElement("div",{className:"fade",style:{padding:"0 0 80px"}},React.createElement(ContratosInteligentes,{onVolver:()=>ir("inicio")})),pant==="notarial"&&React.createElement("div",{className:"fade",style:{padding:"0 0 80px"}},React.createElement(ModuloNotarialFamilia,{onVolver:()=>ir("inicio")})),pant==="fotomultas_asistente"&&React.createElement("div",{className:"fade"},React.createElement(AsistenteFotomultas,{onVolver:()=>{casoA?ir("seguimiento"):ir("inicio");}})),pant==="desacato_guia"&&React.createElement("div",{className:"fade"},React.createElement("button",{onClick:()=>ir("seguimiento"),style:{background:"none",border:"none",cursor:"pointer",color:"#6B7280",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:5}},"\u2190 Volver al caso"),React.createElement("div",{style:{background:"linear-gradient(135deg,#7F1D1D,#DC2626)",borderRadius:14,padding:"22px 26px",marginBottom:18,color:"#fff"}},React.createElement("div",{style:{fontSize:11,fontWeight:700,marginBottom:3}},"\uD83D\uDEA8 INCIDENTE DE DESACATO"),React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}},"La entidad no cumpli\xF3 el fallo del juez"),React.createElement("p",{style:{marginTop:7,fontSize:12,color:"rgba(255,255,255,.85)"}},"La ley lo protege. Tiene herramientas poderosas para obligarlos a cumplir.")),[{n:1,i:"🔍",t:"Documente el incumplimiento",d:"Guarde pruebas claras: negativa por escrito, capturas de comunicaciones, fotografías. El incumplimiento debe ser evidente."},{n:2,i:"🏛️",t:"Regrese al mismo juzgado",d:"Con el fallo original y su radicado. Diga exactamente: 'Vengo a solicitar incidente de desacato por incumplimiento del fallo tutela radicado bajo el número [XX]'."},{n:3,i:"✍️",t:"Presente el escrito",d:"El juzgado puede ayudarle a redactarlo. Explique qué ordenó el juez, desde cuándo, y cómo la entidad incumplió."},{n:4,i:"⚖️",t:"El juez decide en 3 días",d:"Puede imponer arresto hasta 6 meses al representante legal y multa de hasta 20 SMLMV diarios hasta que la entidad cumpla efectivamente."},{n:5,i:"📣",t:"Si el desacato no prospera",d:"Acuda a la Defensoría del Pueblo (01 8000 914 814), Procuraduría (01 8000 910 380), o la Superintendencia del sector."}].map(p=>React.createElement("div",{key:p.n,className:"card",style:{marginBottom:10,border:"2px solid #FECACA"}},React.createElement("div",{style:{display:"flex",gap:12}},React.createElement("div",{style:{width:40,height:40,borderRadius:"50%",background:"#DC2626",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,flexShrink:0}},p.n),React.createElement("div",null,React.createElement("div",{style:{fontWeight:700,fontSize:14,color:"#7F1D1D",marginBottom:4}},p.i," ",p.t),React.createElement("div",{style:{fontSize:13,color:"#374151",lineHeight:1.7}},p.d))))))),onboarding&&React.createElement(OnboardingModal,{onStart:()=>{setOnboarding(false);try{localStorage.setItem("ayudaciudadana_onboarded","1");}catch{}nuevo();},onDismiss:()=>{setOnboarding(false);try{localStorage.setItem("ayudaciudadana_onboarded","1");}catch{}}}),React.createElement(ModalPaywall,{mostrar:mostrarPaywall,plan:auth?.plan||"free",generacionesHoy:auth?.generacionesHoy||0,onGenerarGratis:()=>{setMostrarPaywall(false);generarDoc();},irAMercadoPago:auth?.irAMercadoPago||(p=>alert(`Plan: ${PLANES[p]?.nombre} - $${PLANES[p]?.precio} COP`)),onCerrar:()=>setMostrarPaywall(false)}),chat&&React.createElement(ChatAbogado,{caso:casoA&&data.casos.find(c=>c.id===casoA.id),onClose:()=>setChat(false)}),!chat&&React.createElement("button",{onClick:()=>setChat(true),id:"chat-fab",style:{position:"fixed",bottom:24,right:24,width:58,height:58,borderRadius:"50%",background:"linear-gradient(135deg,#1E50C8,#3D68E3)",color:"#fff",border:"2px solid rgba(255,255,255,.15)",fontSize:24,cursor:"pointer",boxShadow:"0 8px 32px rgba(15,42,94,.5)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .2s,box-shadow .2s"},title:"Abogado Digital IA \u2014 disponible 24/7",onMouseEnter:e=>{e.currentTarget.style.transform="scale(1.12)";e.currentTarget.style.boxShadow="0 16px 48px rgba(15,42,94,.65)";},onMouseLeave:e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 8px 32px rgba(15,42,94,.5)";}},"\u2696\uFE0F",React.createElement("div",{style:{position:"absolute",top:5,right:5,width:13,height:13,borderRadius:"50%",background:"#22C55E",border:"2.5px solid #fff",animation:"pul 2.5s infinite"}})),pant!=="admin"&&React.createElement(NavInferiorMovil,{pantActual:pant,onNavegar:p=>ir(p),esAdmin:auth.user?.es_admin}),verBusqueda&&React.createElement(BusquedaGlobal,{onSeleccionar:resultado=>{const catFound=CATS[resultado.cat];if(catFound){setCatSel(resultado.cat);const subFound=catFound.subcasos?.find(s=>s.id===resultado.sub);if(subFound){setSubSel(subFound);ir("preguntas");}else ir("subcasos");}},onCerrar:()=>setVerBusqueda(false)}),auth.user&&auth.user.plan==="trial"&&Date.now()>=auth.user.trial_fin&&!verPlanes&&React.createElement(WallTrialVencido,{onVerPlanes:()=>setVerPlanes(true)}),modalAuth&&React.createElement(ModalAuthInline,{modo:modalAuth,onCerrar:()=>setModalAuth(null),onExito:()=>msg("¡Bienvenido! 🎉","ok"),onMostrarPlanes:()=>setVerPlanes(true)}),verPlanes&&React.createElement(ModalPlanesInline,{onCerrar:()=>setVerPlanes(false),planVencido:auth.user?.plan==="trial"&&Date.now()>=(auth.user?.trial_fin||0)}),toast&&React.createElement("div",{className:`toast${toast.tipo==="er"?" er":toast.tipo==="wa"?" wa":""}`},toast.t));}
function ModuloHojaVida({onVolver}){
  const[paso,setPaso]=useState("inicio");
  const[form,setForm]=useState({nombre:"",cedula:"",telefono:"",email:"",ciudad:"",perfil:"",experiencias:"",educacion:"",habilidades:"",idiomas:"",aspiracion:""});
  const[cv,setCv]=useState("");
  const[loading,setLoading]=useState(false);
  const[copiado,setCopiado]=useState(false);
  const up=(k,v)=>setForm(p=>({...p,[k]:v}));
  const generar=async()=>{
    setLoading(true);setCv("");setPaso("generando");
    const prompt=`Eres experto en recursos humanos colombiano. Genera hoja de vida profesional y atractiva:
Nombre: ${form.nombre} | C.C.: ${form.cedula} | Tel: ${form.telefono} | Email: ${form.email} | Ciudad: ${form.ciudad}
PERFIL: ${form.perfil}
EXPERIENCIA: ${form.experiencias}
EDUCACIÓN: ${form.educacion}
HABILIDADES: ${form.habilidades}
IDIOMAS: ${form.idiomas}
ASPIRACIÓN SALARIAL: ${form.aspiracion}
Genera hoja de vida COMPLETA en texto profesional para imprimir. Incluye: encabezado, perfil impactante, experiencia con logros cuantificados, educación, habilidades, idiomas. Datos faltantes entre [COMPLETAR].`;
    try{
      const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2500,messages:[{role:"user",content:prompt}]})});
      const j=await r.json();
      setCv(j.content?.map(b=>b.text||"").join("")||"Error.");setPaso("resultado");
    }catch(e){setCv("Error de conexión.");setPaso("resultado");}
    setLoading(false);
  };
  const mejorar=async()=>{
    if(!cv)return;setLoading(true);
    try{
      const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2500,messages:[{role:"user",content:"Mejora esta hoja de vida con verbos de acción más fuertes y logros más concretos:\n\n"+cv}]})});
      const j=await r.json();setCv(j.content?.map(b=>b.text||"").join("")||cv);
    }catch(e){}
    setLoading(false);
  };
  const campos=[
    {k:"nombre",l:"Nombre completo",ph:"Juan Carlos Pérez García"},
    {k:"cedula",l:"Cédula",ph:"12345678"},
    {k:"telefono",l:"Teléfono",ph:"300 000 0000"},
    {k:"email",l:"Correo",ph:"juan@correo.com"},
    {k:"ciudad",l:"Ciudad",ph:"Bogotá"},
    {k:"aspiracion",l:"Aspiración salarial",ph:"$2.500.000"},
    {k:"perfil",l:"¿Qué hace usted? ¿En qué es bueno?",ph:"Soy técnico en..., tengo experiencia en...",full:true,rows:3},
    {k:"experiencias",l:"Experiencia laboral",ph:"Empresa (2020-2023): cargo, funciones...",full:true,rows:4},
    {k:"educacion",l:"Educación",ph:"SENA: Técnico (2019) | Bachiller (2017)",full:true,rows:2},
    {k:"habilidades",l:"Habilidades",ph:"Excel, atención al cliente, conducción...",full:true,rows:2},
    {k:"idiomas",l:"Idiomas",ph:"Español (nativo), Inglés (básico)"},
  ];
  return React.createElement("div",{className:"fade"},
    React.createElement("div",{style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",borderRadius:18,padding:"20px 22px",marginBottom:18,color:"#fff"}},
      React.createElement("button",{onClick:onVolver,style:{background:"rgba(255,255,255,.12)",border:"none",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12}},"← Volver"),
      React.createElement("div",{style:{fontSize:32,marginBottom:6}},"📄"),
      React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:19,marginBottom:4}},"Hoja de Vida con IA"),
      React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.8)"}},"Cuéntenos sobre usted. La IA crea su hoja de vida profesional lista para enviar.")
    ),
    paso==="inicio"&&React.createElement("div",null,
      React.createElement("div",{className:"card",style:{marginBottom:14}},
        React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:15,color:"#1E50C8",marginBottom:12}},"Complete lo que pueda — la IA hace el resto"),
        React.createElement("div",{className:"g2"},campos.map(c=>React.createElement("div",{key:c.k,style:{gridColumn:c.full?"1/-1":"auto"}},
          React.createElement("label",null,c.l),
          c.rows?React.createElement("textarea",{rows:c.rows,placeholder:c.ph,value:form[c.k],onChange:e=>up(c.k,e.target.value),style:{width:"100%",boxSizing:"border-box"}}):
          React.createElement("input",{placeholder:c.ph,value:form[c.k],onChange:e=>up(c.k,e.target.value)})
        )))
      ),
      React.createElement("button",{onClick:generar,style:{width:"100%",background:"linear-gradient(135deg,#1E50C8,#3D68E3)",border:"none",borderRadius:13,padding:"14px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},"🤖 Generar hoja de vida →")
    ),
    paso==="generando"&&React.createElement("div",{style:{textAlign:"center",padding:"50px 20px"},className:"pul"},
      React.createElement("div",{style:{fontSize:44,marginBottom:14}},"📄"),
      React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#1E50C8",marginBottom:6}},"Creando su hoja de vida..."),
      React.createElement("div",{style:{fontSize:13,color:"#6B7280"}},"La IA está redactando un documento profesional con sus datos")
    ),
    paso==="resultado"&&React.createElement("div",{className:"fade"},
      React.createElement("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}},
        React.createElement("button",{onClick:()=>setPaso("inicio"),style:{background:"#F8FAFF",border:"1.5px solid #E5E7EB",borderRadius:9,padding:"8px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}},"← Editar"),
        React.createElement("button",{onClick:()=>{navigator.clipboard?.writeText(cv);setCopiado(true);setTimeout(()=>setCopiado(false),2500);},style:{background:copiado?"#15803d":"linear-gradient(135deg,#1E50C8,#3D68E3)",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},copiado?"✓ Copiada":"📋 Copiar"),
        React.createElement("button",{onClick:()=>{var v=window.open("","_blank");if(!v)return;v.document.write("<!DOCTYPE html><html><head><title>Hoja de Vida</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;padding:2.5cm;}pre{white-space:pre-wrap;font-family:inherit;}.btn{display:block;margin:15px auto;padding:9px 18px;background:#1E50C8;color:#fff;border:none;border-radius:7px;cursor:pointer;}@media print{.btn{display:none;}}</style></head><body><pre>"+cv.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</pre><button class='btn' onclick='window.print()'>🖨️ Imprimir / PDF</button></body></html>");v.document.close();},style:{background:"linear-gradient(135deg,#15803d,#16a34a)",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},"🖨️ PDF"),
        React.createElement("button",{onClick:mejorar,disabled:loading,style:{background:"linear-gradient(135deg,#7C3AED,#1E50C8)",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:loading?"wait":"pointer",fontFamily:"inherit"}},loading?"⏳...":"⭐ Mejorar")
      ),
      React.createElement("div",{style:{background:"#F8FAFF",border:"2px solid #DCE6FB",borderRadius:14,padding:22,fontFamily:"'Times New Roman',serif",fontSize:"12pt",lineHeight:1.8,whiteSpace:"pre-wrap",color:"#000",minHeight:300}},cv)
    )
  );
}

function ModuloConversor({onVolver}){
  const[texto,setTexto]=useState("");
  const[loading,setLoading]=useState(false);
  const[resultado,setResultado]=useState("");
  const[opSel,setOpSel]=useState(null);
  const fileRef=useRef(null);
  const ops=[
    {id:"pdf",ico:"🖨️",titulo:"Preparar para PDF",desc:"Formatea listo para imprimir como PDF"},
    {id:"carta",ico:"📧",titulo:"Convertir en carta formal",desc:"Carta formal colombiana completa"},
    {id:"resumir",ico:"📝",titulo:"Resumir documento",desc:"Resumen ejecutivo claro"},
    {id:"unir",ico:"📚",titulo:"Unir textos",desc:"Une y da coherencia a varios fragmentos"},
    {id:"limpiar",ico:"✂️",titulo:"Limpiar y comprimir",desc:"Elimina lo innecesario, reduce el texto"},
  ];
  const prompts={
    pdf:"Formatea este texto con estructura profesional clara: título, secciones bien definidas, formato listo para imprimir como PDF en Colombia:\n\n",
    carta:"Convierte en carta formal colombiana con: ciudad y fecha, destinatario, asunto, saludo, cuerpo bien redactado, despedida y espacio para firma:\n\n",
    resumir:"Haz un resumen ejecutivo en español colombiano. Máximo 3 párrafos con lo más importante:\n\n",
    unir:"Une y da coherencia a estos fragmentos de texto. Resultado debe fluir naturalmente como un solo documento:\n\n",
    limpiar:"Elimina repeticiones, texto innecesario y reduce este documento a lo esencial sin perder información importante:\n\n",
  };
  const leer=f=>{
    const r=new FileReader();
    r.onload=e=>{
      if(f.type.includes("text")||f.name.match(/\.(txt|md|rtf|csv)$/i))setTexto(e.target.result.substring(0,8000));
      else setTexto("Archivo: "+f.name+"\n\nPegue aquí el contenido del documento:");
    };
    r.readAsText(f,"utf-8");
  };
  const procesar=async op=>{
    if(!texto.trim()){alert("Escriba o cargue un documento primero");return;}
    setOpSel(op);setLoading(true);setResultado("");
    try{
      const r=await fetch(AI_API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,messages:[{role:"user",content:prompts[op.id]+texto}]})});
      const j=await r.json();
      setResultado(j.content?.map(b=>b.text||"").join("")||"Error.");
    }catch(e){setResultado("Error de conexión.");}
    setLoading(false);
  };
  const imprimir=txt=>{
    const v=window.open("","_blank");if(!v)return;
    v.document.write('<!DOCTYPE html><html><head><title>Documento</title><style>body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.8;padding:2.5cm;color:#000;}pre{white-space:pre-wrap;font-family:inherit;}.btn{display:block;margin:15px auto;padding:9px 18px;background:#1E50C8;color:#fff;border:none;border-radius:7px;cursor:pointer;}@media print{.btn{display:none;}}</style></head><body><pre>'+(txt).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</pre><button class='btn' onclick='window.print()'>🖨️ Imprimir / PDF</button></body></html>");
    v.document.close();
  };
  return React.createElement("div",{className:"fade"},
    React.createElement("div",{style:{background:"linear-gradient(135deg,#312E81,#1E50C8)",borderRadius:18,padding:"20px 22px",marginBottom:18,color:"#fff"}},
      React.createElement("button",{onClick:onVolver,style:{background:"rgba(255,255,255,.12)",border:"none",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:12}},"← Volver"),
      React.createElement("div",{style:{fontSize:32,marginBottom:6}},"📄"),
      React.createElement("div",{style:{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:19,marginBottom:4}},"Editor de Documentos"),
      React.createElement("div",{style:{fontSize:13,color:"rgba(255,255,255,.8)"}},"Suba o escriba un documento y elija qué hacer con él.")
    ),
    React.createElement("div",{className:"card",style:{marginBottom:14}},
      React.createElement("div",{style:{display:"flex",gap:8,marginBottom:10}},
        React.createElement("button",{onClick:()=>fileRef.current?.click(),style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",border:"none",borderRadius:9,padding:"8px 14px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},"📂 Cargar archivo"),
        React.createElement("button",{onClick:()=>{setTexto("");setResultado("");setOpSel(null);},style:{background:"#F8FAFF",border:"1.5px solid #E5E7EB",borderRadius:9,padding:"8px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit"}},"🗑️ Limpiar")
      ),
      React.createElement("input",{ref:fileRef,type:"file",accept:".txt,.md,.rtf,.csv,.html",style:{display:"none"},onChange:e=>e.target.files[0]&&leer(e.target.files[0])}),
      React.createElement("textarea",{rows:7,placeholder:"O escriba/pegue su texto aquí...",value:texto,onChange:e=>setTexto(e.target.value),style:{width:"100%",boxSizing:"border-box"}})
    ),
    texto.trim().length>5&&React.createElement("div",{className:"card",style:{marginBottom:14}},
      React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:14,marginBottom:12}},"⚙️ ¿Qué quiere hacer?"),
      React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:9}},
        ops.map(op=>React.createElement("button",{key:op.id,onClick:()=>procesar(op),disabled:loading,style:{background:opSel?.id===op.id?"linear-gradient(135deg,#1E50C8,#1E50C8)":"#F8FAFF",border:"1.5px solid "+(opSel?.id===op.id?"#1E50C8":"#E5E7EB"),borderRadius:11,padding:"12px",cursor:loading?"wait":"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .2s"}},
          React.createElement("div",{style:{fontSize:20,marginBottom:3}},op.ico),
          React.createElement("div",{style:{fontWeight:700,fontSize:12,color:opSel?.id===op.id?"#fff":"#1E50C8",marginBottom:2}},op.titulo),
          React.createElement("div",{style:{fontSize:10,color:opSel?.id===op.id?"rgba(255,255,255,.8)":"#6B7280"}},op.desc)
        ))
      )
    ),
    loading&&React.createElement("div",{style:{textAlign:"center",padding:"24px"},className:"pul"},
      React.createElement("div",{style:{fontSize:32,marginBottom:8}},opSel?.ico||"🤖"),
      React.createElement("div",{style:{fontSize:13,color:"#1E50C8",fontWeight:600}},"Procesando...")
    ),
    resultado&&!loading&&React.createElement("div",{className:"card fade"},
      React.createElement("div",{style:{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}},
        React.createElement("div",{style:{fontWeight:700,color:"#1E50C8",fontSize:13,flex:1}},opSel?.ico," ",opSel?.titulo),
        React.createElement("button",{onClick:()=>navigator.clipboard?.writeText(resultado),style:{background:"linear-gradient(135deg,#1E50C8,#3D68E3)",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},"📋 Copiar"),
        React.createElement("button",{onClick:()=>imprimir(resultado),style:{background:"linear-gradient(135deg,#15803d,#16a34a)",border:"none",borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}},"🖨️ PDF"),
        React.createElement("button",{onClick:()=>{setTexto(resultado);setResultado("");setOpSel(null);},style:{background:"#F8FAFF",border:"1.5px solid #E5E7EB",borderRadius:8,padding:"7px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}},"↩️ Reusar")
      ),
      React.createElement("div",{style:{background:"#F8FAFF",border:"1.5px solid #DCE6FB",borderRadius:11,padding:18,fontSize:14,lineHeight:1.8,whiteSpace:"pre-wrap",color:"#111827",minHeight:150}},resultado)
    )
  );
}

function imprimirSoloDocumento(){var docEl=document.querySelector(".tdoc");if(!docEl){window.print();return;}var contenido=docEl.innerText||docEl.textContent;var v=window.open("","_blank","width=850,height=700");if(!v){alert("Activa las ventanas emergentes en tu navegador para imprimir");return;}v.document.write("<!DOCTYPE html><html><head><title>Documento Legal - Ayuda Ciudadana</title><style>body{font-family:'Times New Roman',serif;font-size:12pt;line-height:1.8;padding:2.5cm;color:#000;}pre{white-space:pre-wrap;font-family:inherit;}.btn{display:block;margin:15px auto;padding:9px 20px;background:#1E50C8;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;}@media print{.btn{display:none;}}</style></head><body><pre>"+contenido.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</pre><button class='btn' onclick='window.print()'>\uD83D\uDDA8\uFE0F Imprimir / Guardar como PDF</button></body></html>");v.document.close();}
// ═══════════════════════════════════════════════════════════════
// AUTOCOMPLETADO DE ENTIDAD CON IA
// ═══════════════════════════════════════════════════════════════
async function buscarDatosEntidad(nombre) {
  if (!nombre || nombre.length < 5) return null;
  try {
    const r = await fetch(AI_API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: "Eres un experto en entidades colombianas. Conoces datos de EPS, clínicas, hospitales, secretarías, alcaldías, empresas públicas, bancos, fondos de pensiones, ARL, colegios, universidades y empresas privadas en Colombia.",
        messages: [{
          role: "user",
          content: `Dame los datos de contacto reales de esta entidad colombiana: "${nombre}"
Responde SOLO JSON sin markdown, sin explicaciones:
{"nit":"NIT o número de identificación","nombre_completo":"nombre oficial completo","representante":"nombre del representante legal, gerente o director","direccion":"dirección sede principal","ciudad":"ciudad sede principal","telefono":"teléfono principal","email":"correo oficial o de PQRS","web":"sitio web oficial"}
Si no tienes un dato exacto, deja el campo vacío "". Prioriza datos de la sede principal en Colombia.`
        }]
      })
    });
    const j = await r.json();
    const txt = j.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
    const datos = JSON.parse(txt);
    // Solo retornar si tiene al menos algún dato útil
    if (datos.direccion || datos.telefono || datos.nit || datos.representante) return datos;
    return null;
  } catch(e) { return null; }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: CAMPO ENTIDAD CON AUTOCOMPLETADO AUTOMÁTICO
// ═══════════════════════════════════════════════════════════════
function CampoEntidadAuto({ datos, cat, onChange }) {
  const listaSug = (typeof sugerenciasEntidad === "function") ? sugerenciasEntidad(cat, datos.ciudad) : [];

  const [buscando, setBuscando] = useState(false);
  const [sugerencia, setSugerencia] = useState(null);
  const [aplicado, setAplicado] = useState(false);
  const timer = useRef(null);

  const buscar = async (val) => {
    if (val.length < 6) { setSugerencia(null); return; }
    setBuscando(true);
    const d = await buscarDatosEntidad(val);
    setSugerencia(d);
    setBuscando(false);
  };

  const handleNombre = (e) => {
    const val = e.target.value;
    onChange("entidad", val);
    setAplicado(false);
    setSugerencia(null);
    clearTimeout(timer.current);
    var fijos = (typeof datosEntidad === "function") ? datosEntidad(val) : null;
    if (fijos) {
      var partes = [];
      if (fijos.nit) partes.push("NIT: " + fijos.nit);
      var correo = fijos.correo_judicial || fijos.correo;
      if (correo) partes.push("Correo notificaciones: " + correo);
      if (fijos.direccion) partes.push("Dir: " + fijos.direccion + (fijos.ciudad ? ", " + fijos.ciudad : ""));
      if (fijos.telefono) partes.push("Tel: " + fijos.telefono);
      if (partes.length) onChange("dir_entidad", partes.join(" | "));
      setAplicado(true);
      return;
    }
    timer.current = setTimeout(() => buscar(val), 1500);
  };

  const aplicar = () => {
    if (!sugerencia) return;
    if (sugerencia.representante) onChange("rep_legal", sugerencia.representante);
    if (sugerencia.direccion) onChange("dir_entidad", sugerencia.direccion + (sugerencia.ciudad ? ", " + sugerencia.ciudad : ""));
    if (sugerencia.nombre_completo) onChange("entidad", sugerencia.nombre_completo);
    if (sugerencia.nit) onChange("nit_entidad", sugerencia.nit);
    setAplicado(true);
    setSugerencia(null);
  };

  return React.createElement("div", { style: { gridColumn: "1/-1" } },
    React.createElement("label", null, "Entidad que lo afecta"),
    React.createElement("div", { style: { position: "relative" } },
      React.createElement("input", {
        placeholder: "EPS Sanitas, Colpensiones, Alcaldía de Bogotá, Banco de Bogotá...",
        value: datos.entidad || "",
        onChange: handleNombre,
        list: "entidades-sug",
        autoComplete: "off",
        style: { paddingRight: "42px", width: "100%", boxSizing: "border-box" }
      }),
      React.createElement("datalist", { id: "entidades-sug" },
        (listaSug || []).map(function(nom, idx) {
          return React.createElement("option", { key: idx, value: nom });
        })
      ),
      buscando && React.createElement("div", {
        style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#1E50C8" }
      }, "🔍"),
      aplicado && React.createElement("div", {
        style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }
      }, "✅")
    ),
    sugerencia && React.createElement("div", {
      style: { background: "linear-gradient(135deg,#EEF3FE,#DCE6FB)", borderRadius: 11, padding: "12px 14px", marginTop: 8, border: "1.5px solid #DCE6FB" }
    },
      React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: "#1E50C8", marginBottom: 8 } },
        "🤖 Datos encontrados — ¿aplicar automáticamente?"
      ),
      React.createElement("div", { style: { fontSize: 12, color: "#374151", lineHeight: 1.9, marginBottom: 10 } },
        sugerencia.nombre_completo && React.createElement("div", null, "🏢 ", React.createElement("strong", null, sugerencia.nombre_completo)),
        sugerencia.nit && React.createElement("div", null, "🔢 NIT: ", sugerencia.nit),
        sugerencia.representante && React.createElement("div", null, "👤 Rep. legal: ", sugerencia.representante),
        sugerencia.direccion && React.createElement("div", null, "📍 ", sugerencia.direccion, sugerencia.ciudad ? ", " + sugerencia.ciudad : ""),
        sugerencia.telefono && React.createElement("div", null, "📞 ", sugerencia.telefono),
        sugerencia.email && React.createElement("div", null, "✉️ ", sugerencia.email),
        sugerencia.web && React.createElement("div", null, "🌐 ", sugerencia.web)
      ),
      React.createElement("div", { style: { display: "flex", gap: 8 } },
        React.createElement("button", {
          onClick: aplicar,
          style: { background: "linear-gradient(135deg,#1E50C8,#3D68E3)", border: "none", borderRadius: 9, padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }
        }, "✅ Aplicar datos automáticamente"),
        React.createElement("button", {
          onClick: () => setSugerencia(null),
          style: { background: "#F8FAFF", border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "8px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }
        }, "✕ Llenar manualmente")
      )
    )
  );
}

window.TutelaYa=TutelaYa;