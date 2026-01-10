// Script para migrar inscripciones a Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Configuración de Firebase (copia de tus variables de entorno)
const firebaseConfig = {
    apiKey: "AIzaSyBUdHdJHR_t8CDUzDv_elJT6WZYyKSdP_g",
    authDomain: "seamosgenios-portal.firebaseapp.com",
    projectId: "seamosgenios-portal",
    storageBucket: "seamosgenios-portal.firebasestorage.app",
    messagingSenderId: "612591680498",
    appId: "1:612591680498:web:36b6d4b3aabde430c3e7c5",
    measurementId: "G-6SJKJPPC1Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de inscripciones (parseados del CSV)
const rawData = `8/12/2025 9:03:52	angie.850gg@gmail.com	Sí	ANGIE SOFIA ALDANA ARIAS 	3227514890	T.I	1014992221	15/1/2009	27/10/2025	250000	M12036062	url	323 394 6963 - Daniel De la cruz	Calendario B	No, yo realicé el pago completo.
5/11/2025 13:22:21	matycarlo17@gmail.com	Sí	MATIAS CARDENAS LOZANO 	311 4953047	T.I	1038118033	17/5/2010	6/10/2025	100000	M31698433	url	323 484 6123 - Daniel De la cruz	Calendario de genios
5/11/2025 14:26:04	santiagoguevara756@gmail.com	Sí	SANTIAGO GUEVARA VELASCO 	3245534107	CC	1059234430	1/3/2004	14/10/2025	80000	M37313800	url	323 484 6123 - Daniel De la cruz	Calendario de genios
16/12/2025 22:36:09	luisfelipe788tam@gmail.com	Sí	LUIS FELIPE ESCUDERO VILLEGAS 	3155547519	T.I	1013126436	10/5/2009	16/12/2025	330000	M24290420, M24271393	url	320 394 6963 - Daniel De la cruz	Calendario G + Calendario B	No, yo realicé el pago completo.
5/11/2025 16:29:09	issaleal.14@gmail.com	Sí	Isabella González Leal	3246634495	T.I	1104822690	5/10/2009	11/10/2025	80000	M29850275	url	323 484 6123 - Daniel De la cruz	Calendario de genios
5/11/2025 18:10:10	ovejerolaurasofia2007@gmail.com	Sí	LAURA SOFÍA OVEJERO MALDONADO 	3208561077	CC	1115690260	8/8/2007	5/11/2025	250000	M24078457	url	323 484 6123 - Daniel De la cruz	Calendario de genios + Cal B
5/11/2025 18:21:01	hkamila531@gmail.com	Sí	KAMILA INES HERRERA MARTINEZ	3207512318	T.I	1049935197	28/4/2009	5/11/2025	250000	0090100217	url	323 484 6123 - Daniel De la cruz	Calendario B
5/11/2025 18:50:47	valeriegamarr4@gmail.com	Sí	VALERIE GAMARRA FONTALVO 	3008411890	T.I	1041981827	21/3/2008	30/9/2025	200000	M15448120	url	323 484 6123 - Daniel De la cruz	Calendario de genios + Cal B
4/12/2025 17:07:01	karolcq208@gmail.com	Sí	KAROL VALENTINA CEBALLOS QUIROZ 	3186066577	T.I	1080052959	11/9/2008	11/10/2025	250000	0090100217	url	323 394 6963 - Daniel De la cruz	Calendario B	No, yo realicé el pago completo.
5/11/2025 19:14:35	caro.soto992@gmail.com	Sí	ANGIE CAROLINA SOTO GIRALDO 	3015412469	T.I	1063158765	16/12/2009	18/10/2025	200000	M9918879	url	323 484 6123 - Daniel De la cruz	Calendario B
5/11/2025 19:22:05	isamont2705@gmail.com	Sí	ISABEL SOFÍA CASTAÑO MONTOYA 	3128028755	T.I	1109669274	27/5/2008	9/10/2025	80000	M35882703	url	323 484 6123 - Daniel De la cruz	Sin Plan
6/11/2025 9:45:56	valeriachatesdanna@gmail.com	Sí	VALERIA FERNANDA GUERRERO CHATES 	3223858993	CC	1086132449	12/5/2004	14/10/2025	80000	11795941354928150718524211297223594	url	323 484 6123 - Daniel De la cruz	Calendario de genios
12/11/2025 18:19:53	juanzccpa@gmail.com	Sí	JUAN DIEGO ZAMBRANO OCAMPO	3219208778	T.I	1077726158	13/1/2009	26/10/2025	250000	0090100217	url	323 484 6123 - Daniel De la cruz	Calendario B
4/12/2025 17:06:00	sv273837@gmail.com	Sí	STEPHANY VELAZCO RODRIGUEZ 	322 7895263 	T.I	1142715366	29/2/2008	10/10/2025	250000	0000066769	url	323 394 6963 - Daniel De la cruz	Calendario G + Calendario B	No, yo realicé el pago completo.
7/11/2025 21:19:15	isabelabarreiro427@gmail.com	Sí	ISABELA BARREIRO  CÁRDENAS 	3182445710	T.I	1077230281	5/9/2008	7/11/2025	250000	M27722964	url	323 484 6123 - Daniel De la cruz	Calendario B
4/12/2025 23:01:30	juan.riveraa2006@gmail.com	Sí	JUAN SEBASTIAN RIVERA AVENDAÑO	3232363008	CC	1051066924	3/2/2006	4/11/2025	0	Beca100	url	323 394 6963 - Daniel De la cruz	Calendario G + Calendario B	No, yo realicé el pago completo.
29/12/2025 8:15:26	jannanore2611@gmail.com	Sí	JANNA YALID NORE PÉREZ 	3228155217	T.I	1029666834	26/11/2011	16/9/2025	375000	M16560283	url	320 394 6963 - Daniel De la cruz	Calendario G + Calendario B + Calendario A	No, yo realicé el pago completo.
8/11/2025 22:10:44	karenyulied22@gmail.com	Sí	KAREN YULIED ARENAS COMETA 	3217962477	CC	1061717282	16/3/2007	6/9/2025	250000	M14806200	url	323 484 6123 - Daniel De la cruz	Calendario de genios + Cal B
9/11/2025 14:46:03	luisantoniomunozhimpa@gmail.com	Sí	LUIS ANTONIO MUÑOZ HINCAPIE	3173072374	T.I	1104821599	3/4/2009	9/11/2025	125000	M05684214	url	323 484 6123 - Daniel De la cruz	Calendario de genios + Cal B
9/11/2025 18:00:01	hoyosadrily@gmail.com	Sí	ADRIANA ISABEL HOYOS HOYOS 	3117555971	T.I	1.103.950.959	28/4/2010	8/11/2025	250000	M8131640	url	323 484 6123 - Daniel De la cruz	Calendario B`;

// Parsear los datos
function parseData(rawData) {
    const lines = rawData.trim().split('\n');
    return lines.map((line, index) => {
        const parts = line.split('\t');

        // Parsear fecha
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            const parts = dateStr.split(' ')[0].split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            return dateStr;
        };

        return {
            fechaRegistro: parseDate(parts[0]),
            email: parts[1]?.trim(),
            confirmado: parts[2] === 'Sí',
            nombre: parts[3]?.trim(),
            telefono: parts[4]?.trim(),
            tipoDocumento: parts[5]?.trim(),
            documento: parts[6]?.trim().replace(/\./g, ''),
            fechaNacimiento: parseDate(parts[7]),
            fechaInscripcion: parseDate(parts[8]),
            monto: parseInt(parts[9]) || 0,
            referenciaPago: parts[10]?.trim(),
            comprobante: parts[11]?.trim(),
            vendedor: parts[12]?.trim(),
            plan: parts[13]?.trim() || 'Sin Plan',
            pagoCompleto: parts[14]?.includes('completo') ? 'Sí' : 'No',
            pagoEnCuotas: parts[14]?.includes('Sí') ? 'Sí' : 'No',
            cuotas: parseInt(parts[15]) || 1,
        };
    });
}

async function migrateToFirestore() {
    console.log('🚀 Iniciando migración a Firestore...');

    const inscripciones = parseData(rawData);
    console.log(`📊 Total de inscripciones a migrar: ${inscripciones.length}`);

    // Usar batches para eficiencia
    const batchSize = 500;
    let batch = writeBatch(db);
    let count = 0;

    for (const inscripcion of inscripciones) {
        const docId = inscripcion.documento || `temp_${count}`;
        const docRef = doc(db, 'inscripciones', docId);

        batch.set(docRef, {
            ...inscripcion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        count++;

        if (count % batchSize === 0) {
            await batch.commit();
            console.log(`✅ Migrados ${count} registros...`);
            batch = writeBatch(db);
        }
    }

    // Commit remaining
    if (count % batchSize !== 0) {
        await batch.commit();
    }

    console.log(`🎉 Migración completada! ${count} inscripciones migradas.`);
}

migrateToFirestore().catch(console.error);
