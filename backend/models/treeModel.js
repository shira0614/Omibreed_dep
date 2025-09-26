const mongoose = require('mongoose')

const SEEDLING_ID_TO_PARENTS = Object.freeze({
	"GM1": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"GM11": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"GM12": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM16": { parent1: "OTTOBRATICA", parent2: "OGLIAROLA SALENTINA" },
	"GM17": { parent1: "CAROLEA", parent2: "NOCIARA" },
	"GM18": { parent1: "CIPRESSINO", parent2: "NOCIARA" },
	"GM19": { parent1: "CAROLEA", parent2: "NOCIARA" },
	"GM2": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM20": { parent1: "LECCINO", parent2: "NOCIARA" },
	"GM22": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"GM24": { parent1: "SILLETTA", parent2: "VASILIKADA" },
	"GM25": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM25 DX": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"GM25 SX": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"GM26": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM27": { parent1: "LECCINO", parent2: "UNKNOWN" },
	"GM29": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM3": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"GM30": { parent1: "CAROLEA", parent2: "NOCIARA" },
	"GM31": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"GM32 GM33": { parent1: "KAROLIA", parent2: "UNKNOWN" },
	"GM4": { parent1: "SIROLE", parent2: "OGLIAROLA SALENTINA" },
	"GM5": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"GM6": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"GM7": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"GM8": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"GM9": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"MG022": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"PC": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S100": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S102": { parent1: "OGLIAROLA SALENTINA", parent2: "UNKNOWN" },
	"S105": { parent1: "LECCINO", parent2: "CIPRESSINO" },
	"S113": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S114": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S118": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S126": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S132": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S139": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S140": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S144": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S149": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S152": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S16": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S161": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S165": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S166": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S167": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S17": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S177": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S18": { parent1: "NOLCA", parent2: "CELLINA DI NARDO`" },
	"S195": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S198": { parent1: "MORAIOLO", parent2: "OGLIAROLA SALENTINA" },
	"S2": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S20": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S202": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S203": { parent1: "UNKNOWN", parent2: "UNKNOWN" },
	"S206": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S207": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S208": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S21": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S210": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S211": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S212": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S215": { parent1: "LECCINO", parent2: "CIPRESSINO" },
	"S218": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S219": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S220": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S225": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S230": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S233": { parent1: "CASTELNOVINA", parent2: "OGLIAROLA SALENTINA" },
	"S234": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S245": { parent1: "NOCELLARA MESSINESE", parent2: "UNKNOWN" },
	"S25": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S270": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S271": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S272": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S273": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S274": { parent1: "LECCINO", parent2: "CIPRESSINO" },
	"S276": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S277": { parent1: "UNKNOWN", parent2: "UNKNOWN" },
	"S278": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S279": { parent1: "FRANTOIO", parent2: "PENDOLINO" },
	"S28": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S284": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S285": { parent1: "CORATINA", parent2: "UNKNOWN" },
	"S286": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S288": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S292": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S293": { parent1: "NOCIARA", parent2: "UNKNOWN" },
	"S294": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S295": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S296": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S299": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S3": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S301P": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S302": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S303": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S305": { parent1: "OTTOBRATICA", parent2: "OGLIAROLA SALENTINA" },
	"S306": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S307": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S308": { parent1: "CALATINA", parent2: "OGLIAROLA SALENTINA" },
	"S308Bis": { parent1: "CALATINA", parent2: "OGLIAROLA SALENTINA" },
	"S309": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S310": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S311": { parent1: "NOCIARA", parent2: "OGLIAROLA SALENTINA" },
	"S312": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S313": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S32": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S38": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S40": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S45": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S46": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S47": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S48": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S49": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S50": { parent1: "UNKNOWN", parent2: "UNKNOWN" },
	"S51": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S52": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S53": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S61": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S62": { parent1: "CAROLEA", parent2: "NOCIARA" },
	"S64": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S67": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S68": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S7": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S70": { parent1: "UNKNOWN", parent2: "OGLIAROLA SALENTINA" },
	"S75": { parent1: "CORATINA", parent2: "UNKNOWN" },
	"S77": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S78": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S79": { parent1: "LECCIO DEL CORNO", parent2: "OGLIAROLA SALENTINA" },
	"S8": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S80": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S85": { parent1: "NOCIARA", parent2: "CELLINA DI NARDO`" },
	"S89": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S9": { parent1: "UNKNOWN", parent2: "CELLINA DI NARDO`" },
	"S90": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" },
	"S95": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S97": { parent1: "LECCINO", parent2: "CELLINA DI NARDO`" },
	"S98": { parent1: "LECCINO", parent2: "OGLIAROLA SALENTINA" }
})

const SEEDLING_IDS = Object.freeze(Object.keys(SEEDLING_ID_TO_PARENTS))

const CULTIVAR_NAME_TO_CODE = Object.freeze({
	"Bella di Spagna": "BLL1",
	"Cellina di Nardo": "CLLN",
	"Dolce di Cassano": "DLC2",
	"Ogliastro": "GLSN",
	"Oliastro": "LST3",
	"Abbadi Abou Gabra": "BBDN",
	"Abou Kanakia": "BKNN",
	"Abou Satl Mohanzama": "BSTN",
	"Adramitini": "DRMN",
	"Adroupa": "DRPN",
	"Agouromanakolia Manaki": "GRMN",
	"Agristigna": "GRSN",
	"Aguromanakoia": "GRM1",
	"Aitana": "TNAN",
	"Alfafara": "LFFN",
	"Allora Marrakech": "LLRN",
	"Amargoso": "MRGN",
	"Americano": "MRCN",
	"Amigdalolia Nana": "MGDN",
	"Arauco": "RCAN",
	"Arbequina": "RBQN",
	"Arbosana": "RBSN",
	"Ascolana Tenera": "SCLN",
	"Aurina di Venafro": "RNDN",
	"Ayvalik": "YVLN",
	"Barnea": "BRNN",
	"Barri": "BRRN",
	"Bella di Cerignola": "BLLN",
	"Bianchera": "BNCN",
	"Biancolilla": "BNC1",
	"Biancolilla Cilentana": "BNC2",
	"Bingemma Gozo 1": "BNGN",
	"Blanqueta": "BLNN",
	"Bolvino": "BLVN",
	"Borgiona": "BRGN",
	"Bottone di Gallo": "BTTN",
	"Boutellaine": "BTLN",
	"Branquita": "BRN1",
	"Branquita De Elvas": "BRN2",
	"Buga": "BGUN",
	"Bujuk Topakislak": "BJKN",
	"Caiazzana": "CZZN",
	"Cakir": "CKRN",
	"Calatina": "CLTN",
	"Canetera": "CNTN",
	"Canino": "CNNN",
	"Canivano Nigro": "CNVN",
	"Capolga Er": "CPLN",
	"Cariasina": "CRSN",
	"Carmelitana": "CRMN",
	"Carolea": "CRLN",
	"Carrasqueno Alcaudete": "CRRN",
	"Cassanese": "CSSN",
	"Castelnovina": "CSTN",
	"Castiglionese": "CST1",
	"Cerasa di Montenero": "CRS1",
	"Cerasuola": "CRS2",
	"Chalchali": "CHLN",
	"Chalkidikis": "CHL1",
	"Changlot Real": "CHNN",
	"Chemlal De Kabilye": "CHMN",
	"Chetoui": "CHTN",
	"Chiquitita": "CHQN",
	"Cicerello": "CCRN",
	"Cicione": "CCNN",
	"Ciliegiolo": "CLGN",
	"Cima di Melfi ": "CMDN",
	"Cipressino": "CPRN",
	"Cipro 1": "CPR1",
	"Cobrancosa": "CBRN",
	"Colombina": "CLMN",
	"Coratina": "CRTN",
	"Cordovil De Serpa": "CRDN",
	"Cornarella": "CRNN",
	"Cornezuelo": "CRN1",
	"Cornicabra": "CRN2",
	"Cornilar": "CRN3",
	"Corniola Pugliese": "CRN4",
	"Coroncina": "CRN5",
	"Correggiolo": "CRR1",
	"Crnica": "CRN6",
	"Cucca": "CCCN",
	"Cucca Montopoli": "CCC1",
	"Cucco": "CCC2",
	"Cuoricino": "CRCN",
	"Dokkar": "DKKN",
	"Dolce Agogia": "DLCN",
	"Dolce D'andria": "DLC1",
	"Dolce di Rossano": "DLC3",
	"Domat": "DMTN",
	"Don Carlo": "DNCN",
	"Donna Giulietta": "DNNN",
	"Dritta di Moscufo": "DRTN",
	"E Gravino 8 Molise": "GRVN",
	"Emilia": "MLEN",
	"Empeltre": "MPLN",
	"Erbano": "RBNN",
	"Favarol": "FVRN",
	"Femminella": "FMMN",
	"Fishomi Cordoba": "FSHN",
	"Fontana Del Pino": "FNTN",
	"Forastera De Tortosa": "FRSN",
	"Frantoio": "FRNN",
	"FS17": "FSXN",
	"Galega Vulgar": "GLGN",
	"Gargna": "GRGN",
	"Gemlik": "GMLN",
	"Genovesa 11": "GNVN",
	"Gentile d'anghiari": "GNTN",
	"Gentile di Chieti": "GNT1",
	"Gerboui": "GRBN",
	"Ghiacciolo": "GHCN",
	"Giulia": "GLIN",
	"Gnacolo": "GNCN",
	"Gordal De Granada": "GRDN",
	"Gordal Sevillana": "GRD1",
	"Grappuda": "GRPN",
	"Griteytini": "GRTN",
	"Grossa di Gerace": "GRS1",
	"Grossane": "GRS2",
	"Grossolana": "GRS3",
	"Hojblanca": "HJBN",
	"Imperial": "MPRN",
	"Intosso": "NTSN",
	"Itrana": "TRNN",
	"Izmir Sofralik": "ZMRN",
	"Jabali": "JBLN",
	"Jacouti": "JCTN",
	"Jemri Bouchouka": "JMRN",
	"Jlot": "JLTN",
	"Joanenca": "JNNN",
	"Justi": "JSTN",
	"Kadesh": "KDSN",
	"Kaissy": "KSSN",
	"Kalamata": "KLMN",
	"Kalem Bezi Gaydourelia": "KLM1",
	"Kan Celebi": "KNCN",
	"Kiraz": "KRZN",
	"Klon 14": "KLNN",
	"Kolibada": "KLBN",
	"Konservolia San'agostino": "KNSN",
	"Koroneiki": "KRNN",
	"Lastovka": "LSTN",
	"Lastrino": "LST1",
	"Lazzero": "LZZN",
	"Lazzero di Prata": "LZZ1",
	"Leccino": "LCCN",
	"Leccio Del Corno": "LCC1",
	"Leccio Maremmano": "LCC2",
	"Leccione": "LCC3",
	"Lechin De Sevilla": "LCHN",
	"Lechin De Granada": "LCH1",
	"Less": "LSSN",
	"Leucocarpa": "LCC4",
	"Levantinka": "LVNN",
	"Lianolia Kerkiras": "LNLN",
	"Liccione": "LCC5",
	"Liguria": "LGRN",
	"Limongella": "LMNN",
	"Llumeta": "LLMN",
	"Loaime": "LMON",
	"Lucio": "LCUN",
	"Lumiaro": "LMRN",
	"Luques": "LQSN",
	"Maari": "MRAN",
	"Machorrones": "MCHN",
	"Madonna Dell'impruneta": "MDNN",
	"Madre Mignola": "MDRN",
	"Maiorca": "MRC1",
	"Majatica Ulliri Bard": "MJTN",
	"Majhol 1013": "MJHN",
	"Majhol -152": "MJH1",
	"Manaki": "MNKN",
	"Manzanilla Cacerena": "MNZN",
	"Manzanilla De Jaen": "MNZ1",
	"Manzanilla De Sevilla": "MNZ2",
	"Manzanilla Del Piquito": "MNZ3",
	"Manzanilla Dos Hermanos ": "MNZ4",
	"Manzanillera De Huercal Overa": "MNZ5",
	"Maremmano Marr": "MRMN",
	"Marfill-112": "MRFN",
	"Mari Cordoba": "MRC2",
	"Mari-1": "MRA1",
	"Marina": "MRNN",
	"Marzio": "MRZN",
	"Massahabi": "MSSN",
	"Mastoidis": "MSTN",
	"Maureya": "MRYN",
	"Maurino": "MRN1",
	"Megaritiki": "MGRN",
	"Memecik": "MMCN",
	"Menya": "MNYN",
	"Mercatello": "MRC3",
	"Merhavia": "MRHN",
	"Meski": "MSKN",
	"Mignolo Cerretano": "MGNN",
	"Miniol": "MNLN",
	"Minuta": "MNTN",
	"Mollar Cieza": "MLLN",
	"Moraiolo": "MRLN",
	"Moresca": "MRSN",
	"Morisca": "MRS1",
	"Morona": "MRN2",
	"Morrut": "MRRN",
	"Myrtolia": "MYRN",
	"Nabali": "NBLN",
	"Nasitana": "NSTN",
	"Nebbia Del Menocchia": "NBBN",
	"Negrera": "NGRN",
	"Negrillo De Estepa": "NGR1",
	"Nera di Gonnos": "NRDN",
	"Nera di Villacidro": "NRD1",
	"Nocellara Del Belice": "NCLN",
	"Nocellara Etnea": "NCL1",
	"Nocellara Messinese": "NCL2",
	"Nociara": "NCRN",
	"Nostrale di Brisighella": "NST1",
	"Nostrale di Rigali": "NST2",
	"Oblica": "BLCN",
	"Occhiola": "CCHN",
	"Ogliarola Messinese": "GLRN",
	"Ogliarola Salentina": "GLR1",
	"Ogliastrone di Vallo": "GLS1",
	"Oleastro Laziale": "LST2",
	"Oliva Da Olio": "LVDN",
	"Oliva Nera di Colletorto": "LVN1",
	"Olivago": "LVGN",
	"Olivastra": "LVSN",
	"Olivastra di Populonia": "LVS1",
	"Olivastra Seggianese": "LVS2",
	"Olivastro di Montenero": "LVS3",
	"Olivastrone Sabino": "LVS4",
	"Olivo Da Olio": "LVD1",
	"Olivo di Casavecchia": "LVD2",
	"Olivo di San Gennaro": "LVD3",
	"Olivo San Lorenzo": "LVS5",
	"Olivo San Lupo": "LVS6",
	"Olivone di Viterbo Morella": "LVN2",
	"Orbetana": "RBTN",
	"Ortice": "RTCN",
	"Ortolana": "RTLN",
	"Pallara": "PLLN",
	"Palmareccia": "PLMN",
	"Palomar": "PLM1",
	"Pasola": "PSLN",
	"Passalunara": "PSSN",
	"Pegaso": "PGSN",
	"Pendolino": "PNDN",
	"Pepino": "PPNN",
	"Peranzana": "PRNN",
	"Piangente": "PNGN",
	"Piantone di Falerone": "PNTN",
	"Piantone di Mogliano": "PNT1",
	"Picholine Languedoc": "PCHN",
	"Picholine Marocaine": "PCH1",
	"Picolimon": "PCLN",
	"Picual": "PCL1",
	"Picudo": "PCDN",
	"Pinonera": "PNNN",
	"Pizze' Garroca": "PZZN",
	"Pizzutella": "PZZ1",
	"Politti Padenghe": "PLTN",
	"Polvese 37": "PLVN",
	"Priego De Cordoba 1 - Chioma": "PRGN",
	"Priego De Cordoba 1 - Pollone": "PRG1",
	"Priego De Cordoba 2 - Chioma": "PRG2",
	"Priego De Cordoba 2 - Pollone": "PRG3",
	"Racioppa": "RCPN",
	"Raggiola": "RGGN",
	"Raio": "RAIN",
	"Ramignana": "RMGN",
	"Randazzese Brandofino": "RND1",
	"Rapasayo": "RPSN",
	"Ravece ": "RVCN",
	"Razzaio Marra": "RZZN",
	"Razzo": "RZZ1",
	"Redondil": "RDNN",
	"Regina": "RGNN",
	"Rizza": "RZZ2",
	"Roggianella": "RGG1",
	"Romana": "RMNN",
	"Rosciola Laziale": "RSCN",
	"Rosciola Marche Vedi Minucciola Lugnano": "RSC1",
	"Rosciola Umbra": "RSC2",
	"Rossanell": "RSSN",
	"Rossellino Cerretano": "RSS1",
	"Rossina": "RSS2",
	"Rotondella Melfi": "RTNN",
	"Rowghani": "RWGN",
	"Rowghani Cordoba": "RWG1",
	"Royal De Cazorla": "RYLN",
	"Safrawi": "SFRN",
	"Salegna": "SLGN",
	"Salella": "SLLN",
	"Salicino": "SLCN",
	"Salonenque": "SLNN",
	"San Francesco": "SNFN",
	"San Sivino": "SNSN",
	"Sansum Tazumalik": "SNS1",
	"Sant' Emiliano": "SNTN",
	"Sargano di Fermo": "SRGN",
	"Scarlinese": "SCRN",
	"Semidana": "SMDN",
	"Sevillenca": "SVLN",
	"Shengeh": "SHNN",
	"Shengeh Cordoba": "SHN1",
	"Siktita": "SKTN",
	"Silletta": "SLL1",
	"Simjaca": "SMJN",
	"Simone": "SMNN",
	"Sinop": "SNPN",
	"Sirole": "SRLN",
	"Sivigliana Da Mensa Vedi Sevigliana Sarda Lugnano": "SVGN",
	"Sol4": "SLON",
	"Sourani": "SRNN",
	"Sperone di Gallo": "SPRN",
	"Tanche": "TNCN",
	"Tantifiori": "TNTN",
	"Temprano": "TMPN",
	"Tendellone": "TNDN",
	"Termite di Bitetto": "TRMN",
	"Toccolana": "TCCN",
	"Toffahi": "TFFN",
	"Tommarella": "TMMN",
	"Tonda di Cagliari": "TND1",
	"Tonda di Filadelfia": "TND2",
	"Tonda Iblea": "TND3",
	"Tortiglione": "TRTN",
	"Toscanina": "TSCN",
	"Trylia O Gemlik": "TRYN",
	"Tumbareddu": "TMBN",
	"U017": "UXXN",
	"U034": "UXX1",
	"U114": "UXX2",
	"Uovo di Piccione": "VDPN",
	"Uslu": "SLUN",
	"Vaddarica": "VDDN",
	"Vera": "VREN",
	"Verdale Vedi Mastoidis Lugnano": "VRDN",
	"Verdello": "VRD1",
	"Verdial De Badajoz": "VRD2",
	"Verdial De Huevar": "VRD3",
	"Verdial De Velez Malaga": "VRD4",
	"Verdiell": "VRD5",
	"Verzola": "VRZN",
	"Vigna Della Corte Occhio A Sinopolese": "VGNN",
	"Vocio": "VCON",
	"Wardan": "WRDN",
	"Yuncelebi": "YNCN",
	"Zaituna": "ZTNN",
	"Zaity": "ZTYN",
	"Zalmati": "ZLMN",
	"Zard": "ZRDN",
	"Zard Cordoba": "ZRD1",
	"Unknow Antico": "NKNN",
	"Unknow Wild": "NKN1"
})

const CULTIVAR_ENUM = Object.freeze(Object.keys(CULTIVAR_NAME_TO_CODE))

const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const treeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
	treeUniqueId: String,
	supplierPlantId: String,
	speciesCommonName: {
		type: String,
		enum: ['Olive', 'Almond', 'Cherry'],
	},
	speciesScientificName: {
		type: String,
		enum: ['Olea europaea', 'Prunus dulcis', 'Prunus avium']
	},
	subspecies: String,
	subspeciesDropdown: {
		type: String,
		enum: ['subsp. cuspidata', 'subsp. maroccana', 'subsp. cerasiformis', 'subsp. guanchica', 'subsp. laperrinei', 'subsp. europaea'],
		required: false
	},
	variety: {
		type: String,
		enum: ['var. europaea', 'var. sylvestris'],
		required: false
	},
	cultivarOrSeedling: {
		type: String,
		enum: ['Cultivar', 'Seedling']
	},
	cultivar: {
		type: String,
		enum: CULTIVAR_ENUM,
	},
	cultivarCode: {
		type: String
	},
	// Collection where cultivar/seedling is stored
	collectionLocation: {
		type: String,
		enum: ['Almar', 'Bexyl', 'Boneggio', 'Follonica', 'Lugnano', 'Parabita', 'Pastene', 'Repository DNA', 'not reported']
	},
	// Known response of cultivar/seedling to Xf infection
	xfInfectionResponse: {
		type: String,
		enum: ['HR', 'R', 'T', 'S', 'HS']
	},
	// DNA repository metadata
	dnaCode: String,
	dnaRepository: String,
	foundingInstitution: String,
	// Genetic identification using SSRs (reference or original name)
	geneticIdentificationSSRs: String,
	// Plant collection metadata
	plantCollectionName: String,
	plantPositionInCollection: String,
	growthEnvironment: {
		type: String,
		enum: ['Experimental facility', 'Greenhouse', 'Open field']
	},
	// Geospatial and location details
	latitude: {
		type: Number,
		min: -90,
		max: 90
	},
	longitude: {
		type: Number,
		min: -180,
		max: 180
	},
	country: String,
	region: String,
	province: String,
	city: String,
	row: String,
	positionInRow: String,
	// Demarcated area (only meaningful when growthEnvironment is Open field)
	demarcatedArea: {
		type: String,
		enum: ['Xf-free zone', 'Xf-infected area', 'Xf-buffer area']
	},
	// Field planting metadata
	yearOfPlanting: Number,
	ancientPlant: Boolean,
	agronomicManagementPractice: {
		type: String,
		enum: ['Auto-rooted', 'Grafted', 'Cultivated in vitro', 'Propagated by seed', 'Potted plant', 'Field plant']
	},
	// Xf exposure and inoculation metadata
	typeOfExpositionToXfInfection: {
		type: String,
		enum: ['Natural', 'Artificial']
	},
	typeOfInoculation: {
		type: String,
		enum: ['Xf inoculated', 'Mock inoculated'],
		required: false
	},
	// Controlled conditions (only meaningful when growthEnvironment is Experimental facility or Greenhouse)
	controlledFacilityName: String,
	propagationYear: Number,
	// Genotyping and resources
	geneticIdentificationSNPs: Boolean,
	geneticMapAvailable: Boolean,
	resequencingWgsAvailable: Boolean,
	stressType: {
		type: String,
		enum: ['Drought stress', 'Cold stress', 'Agronomic traits', 'GWAS Xf', 'GWAS drought stress', 'GWAS cold stress']
	},
	// Seedling selection and auto-parents (available for all species; only used when cultivarOrSeedling === 'Seedling')
	seedlingId: {
		type: String,
		enum: SEEDLING_IDS,
		required: false
	},
	parent1: String,
	parent2: String,
	diagnosticStatus: {
		type: String,
		enum: ['H', 'X', 'NT']
	},
	bacterialTitreCq: Number,
	supplierSampleId: String,
	incrementalNumber: Number,
    replicas: [{
        replicaUniqueId: String
    }],
    inoculated: Boolean,
    infectionType: String,
    timestamp: Date,
    notes: String,
    image: imageSchema,
	lastReplicaId: Number,
	lastCultivarId: Number
})

treeSchema.pre('save', async function(next) {
    try {
        // Auto-map species scientific from common
        if (this.isModified('speciesCommonName') || !this.speciesScientificName) {
            const speciesMap = { Olive: 'Olea europaea', Almond: 'Prunus dulcis', Cherry: 'Prunus avium' }
            if (this.speciesCommonName && speciesMap[this.speciesCommonName]) {
                this.speciesScientificName = speciesMap[this.speciesCommonName]
            }
        }

        // Handle subspecies/variety visibility
        if (this.speciesScientificName === 'Olea europaea') {
            if (this.subspeciesDropdown) this.subspecies = this.subspeciesDropdown
        } else {
            this.subspeciesDropdown = undefined
            this.variety = undefined
        }

        // Compute cultivar code (allow seedlings without cultivar)
        const code = this.cultivar ? CULTIVAR_NAME_TO_CODE[this.cultivar] : undefined
        if (this.cultivar && !code && this.cultivarOrSeedling !== 'Seedling') {
            return next(new Error(`Unknown cultivar name: ${this.cultivar}`))
        }
        this.cultivarCode = code

        // Seedling parents auto-fill
        if (this.cultivarOrSeedling === 'Seedling') {
            if (this.seedlingId) {
                const parents = SEEDLING_ID_TO_PARENTS[this.seedlingId]
                if (parents) {
                    this.parent1 = parents.parent1
                    this.parent2 = parents.parent2
                }
            }
        } else if (this.cultivarOrSeedling === 'Cultivar') {
            this.seedlingId = undefined
            this.parent1 = undefined
            this.parent2 = undefined
        }

        // Controlled conditions fields only if growthEnvironment is Experimental facility or Greenhouse
        const isControlled = this.growthEnvironment === 'Experimental facility' || this.growthEnvironment === 'Greenhouse'
        if (!isControlled) {
            this.controlledFacilityName = undefined
            this.propagationYear = undefined
        }

        // Demarcated area only if Open field
        const isOpenField = this.growthEnvironment === 'Open field'
        if (!isOpenField) {
            this.demarcatedArea = undefined
        }

        // Inoculation details only when exposition is Artificial
        if (this.typeOfExpositionToXfInfection !== 'Artificial') {
            this.typeOfInoculation = undefined
        }

        if (this.isNew || this.isModified('cultivar') || this.isModified('seedlingId') || this.isModified('bacterialTitreCq') || this.isModified('diagnosticStatus') || this.isModified('cultivarOrSeedling')) {

            if (!this.diagnosticStatus) {
                if (typeof this.bacterialTitreCq === 'number') {
                    if (this.bacterialTitreCq > 33) this.diagnosticStatus = 'H'
                    else if (this.bacterialTitreCq < 33) this.diagnosticStatus = 'X'
                    else this.diagnosticStatus = 'NT'
                } else {
                    this.diagnosticStatus = 'NT'
                }
            }

            if (typeof this.incrementalNumber !== 'number') {
                const Tree = mongoose.model('Tree')
                const latest = await Tree.find({}).sort({ incrementalNumber: -1 }).limit(1)
                const currentMax = latest.length > 0 && typeof latest[0].incrementalNumber === 'number' ? latest[0].incrementalNumber : 0
                this.incrementalNumber = currentMax + 1
            }

            const idCode = this.cultivarCode || this.seedlingId || 'SEED'
            const plantId = this.plantPositionInCollection || this.supplierPlantId || 'PLANT'
            this.treeUniqueId = `${idCode}_${plantId}_${this.incrementalNumber}`
        }
        next()
    } catch (err) {
        next(err)
    }
})

const treeModel = mongoose.model('Tree', treeSchema)

module.exports = treeModel