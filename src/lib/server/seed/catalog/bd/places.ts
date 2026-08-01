export interface PlaceSeed {
	id: string;
	name: string;
	nameLocal: string;
	division: string;
	latitude: number;
	longitude: number;
	/** 100 is a primary hub, 10 a small district town. */
	popularity: number;
}

/** District towns and cities across all eight divisions of Bangladesh. */
export const BD_PLACES: PlaceSeed[] = [
	{
		id: 'dhaka',
		name: 'Dhaka',
		nameLocal: 'ঢাকা',
		division: 'Dhaka',
		latitude: 23.8103,
		longitude: 90.4125,
		popularity: 100
	},
	{
		id: 'chattogram',
		name: 'Chattogram',
		nameLocal: 'চট্টগ্রাম',
		division: 'Chattogram',
		latitude: 22.3569,
		longitude: 91.7832,
		popularity: 95
	},
	{
		id: 'sylhet',
		name: 'Sylhet',
		nameLocal: 'সিলেট',
		division: 'Sylhet',
		latitude: 24.8949,
		longitude: 91.8687,
		popularity: 88
	},
	{
		id: 'khulna',
		name: 'Khulna',
		nameLocal: 'খুলনা',
		division: 'Khulna',
		latitude: 22.8456,
		longitude: 89.5403,
		popularity: 85
	},
	{
		id: 'rajshahi',
		name: 'Rajshahi',
		nameLocal: 'রাজশাহী',
		division: 'Rajshahi',
		latitude: 24.3745,
		longitude: 88.6042,
		popularity: 84
	},
	{
		id: 'coxs-bazar',
		name: "Cox's Bazar",
		nameLocal: 'কক্সবাজার',
		division: 'Chattogram',
		latitude: 21.4272,
		longitude: 92.0058,
		popularity: 90
	},
	{
		id: 'barishal',
		name: 'Barishal',
		nameLocal: 'বরিশাল',
		division: 'Barishal',
		latitude: 22.701,
		longitude: 90.3535,
		popularity: 78
	},
	{
		id: 'rangpur',
		name: 'Rangpur',
		nameLocal: 'রংপুর',
		division: 'Rangpur',
		latitude: 25.7439,
		longitude: 89.2752,
		popularity: 76
	},
	{
		id: 'mymensingh',
		name: 'Mymensingh',
		nameLocal: 'ময়মনসিংহ',
		division: 'Mymensingh',
		latitude: 24.7471,
		longitude: 90.4203,
		popularity: 74
	},
	{
		id: 'cumilla',
		name: 'Cumilla',
		nameLocal: 'কুমিল্লা',
		division: 'Chattogram',
		latitude: 23.4607,
		longitude: 91.1809,
		popularity: 70
	},
	{
		id: 'jashore',
		name: 'Jashore',
		nameLocal: 'যশোর',
		division: 'Khulna',
		latitude: 23.1664,
		longitude: 89.2081,
		popularity: 68
	},
	{
		id: 'bogura',
		name: 'Bogura',
		nameLocal: 'বগুড়া',
		division: 'Rajshahi',
		latitude: 24.8465,
		longitude: 89.3773,
		popularity: 66
	},
	{
		id: 'dinajpur',
		name: 'Dinajpur',
		nameLocal: 'দিনাজপুর',
		division: 'Rangpur',
		latitude: 25.6217,
		longitude: 88.6354,
		popularity: 58
	},
	{
		id: 'gazipur',
		name: 'Gazipur',
		nameLocal: 'গাজীপুর',
		division: 'Dhaka',
		latitude: 23.9999,
		longitude: 90.4203,
		popularity: 60
	},
	{
		id: 'narayanganj',
		name: 'Narayanganj',
		nameLocal: 'নারায়ণগঞ্জ',
		division: 'Dhaka',
		latitude: 23.6238,
		longitude: 90.5,
		popularity: 56
	},
	{
		id: 'tangail',
		name: 'Tangail',
		nameLocal: 'টাঙ্গাইল',
		division: 'Dhaka',
		latitude: 24.2513,
		longitude: 89.9167,
		popularity: 54
	},
	{
		id: 'faridpur',
		name: 'Faridpur',
		nameLocal: 'ফরিদপুর',
		division: 'Dhaka',
		latitude: 23.607,
		longitude: 89.8429,
		popularity: 50
	},
	{
		id: 'kushtia',
		name: 'Kushtia',
		nameLocal: 'কুষ্টিয়া',
		division: 'Khulna',
		latitude: 23.9013,
		longitude: 89.1206,
		popularity: 52
	},
	{
		id: 'pabna',
		name: 'Pabna',
		nameLocal: 'পাবনা',
		division: 'Rajshahi',
		latitude: 24.0064,
		longitude: 89.2372,
		popularity: 50
	},
	{
		id: 'sirajganj',
		name: 'Sirajganj',
		nameLocal: 'সিরাজগঞ্জ',
		division: 'Rajshahi',
		latitude: 24.4534,
		longitude: 89.7007,
		popularity: 48
	},
	{
		id: 'naogaon',
		name: 'Naogaon',
		nameLocal: 'নওগাঁ',
		division: 'Rajshahi',
		latitude: 24.7936,
		longitude: 88.9318,
		popularity: 44
	},
	{
		id: 'natore',
		name: 'Natore',
		nameLocal: 'নাটোর',
		division: 'Rajshahi',
		latitude: 24.4206,
		longitude: 89.0,
		popularity: 42
	},
	{
		id: 'chapainawabganj',
		name: 'Chapainawabganj',
		nameLocal: 'চাঁপাইনবাবগঞ্জ',
		division: 'Rajshahi',
		latitude: 24.5965,
		longitude: 88.2775,
		popularity: 40
	},
	{
		id: 'joypurhat',
		name: 'Joypurhat',
		nameLocal: 'জয়পুরহাট',
		division: 'Rajshahi',
		latitude: 25.0968,
		longitude: 89.0227,
		popularity: 36
	},
	{
		id: 'saidpur',
		name: 'Saidpur',
		nameLocal: 'সৈয়দপুর',
		division: 'Rangpur',
		latitude: 25.7776,
		longitude: 88.8918,
		popularity: 46
	},
	{
		id: 'thakurgaon',
		name: 'Thakurgaon',
		nameLocal: 'ঠাকুরগাঁও',
		division: 'Rangpur',
		latitude: 26.0337,
		longitude: 88.4616,
		popularity: 38
	},
	{
		id: 'panchagarh',
		name: 'Panchagarh',
		nameLocal: 'পঞ্চগড়',
		division: 'Rangpur',
		latitude: 26.3411,
		longitude: 88.5542,
		popularity: 36
	},
	{
		id: 'kurigram',
		name: 'Kurigram',
		nameLocal: 'কুড়িগ্রাম',
		division: 'Rangpur',
		latitude: 25.8072,
		longitude: 89.6295,
		popularity: 34
	},
	{
		id: 'gaibandha',
		name: 'Gaibandha',
		nameLocal: 'গাইবান্ধা',
		division: 'Rangpur',
		latitude: 25.3288,
		longitude: 89.5281,
		popularity: 34
	},
	{
		id: 'lalmonirhat',
		name: 'Lalmonirhat',
		nameLocal: 'লালমনিরহাট',
		division: 'Rangpur',
		latitude: 25.9923,
		longitude: 89.2847,
		popularity: 32
	},
	{
		id: 'nilphamari',
		name: 'Nilphamari',
		nameLocal: 'নীলফামারী',
		division: 'Rangpur',
		latitude: 25.9317,
		longitude: 88.856,
		popularity: 32
	},
	{
		id: 'satkhira',
		name: 'Satkhira',
		nameLocal: 'সাতক্ষীরা',
		division: 'Khulna',
		latitude: 22.7185,
		longitude: 89.0705,
		popularity: 40
	},
	{
		id: 'bagerhat',
		name: 'Bagerhat',
		nameLocal: 'বাগেরহাট',
		division: 'Khulna',
		latitude: 22.6516,
		longitude: 89.7859,
		popularity: 36
	},
	{
		id: 'narail',
		name: 'Narail',
		nameLocal: 'নড়াইল',
		division: 'Khulna',
		latitude: 23.1725,
		longitude: 89.5127,
		popularity: 30
	},
	{
		id: 'magura',
		name: 'Magura',
		nameLocal: 'মাগুরা',
		division: 'Khulna',
		latitude: 23.4855,
		longitude: 89.4198,
		popularity: 30
	},
	{
		id: 'jhenaidah',
		name: 'Jhenaidah',
		nameLocal: 'ঝিনাইদহ',
		division: 'Khulna',
		latitude: 23.5448,
		longitude: 89.1539,
		popularity: 34
	},
	{
		id: 'chuadanga',
		name: 'Chuadanga',
		nameLocal: 'চুয়াডাঙ্গা',
		division: 'Khulna',
		latitude: 23.6402,
		longitude: 88.8412,
		popularity: 32
	},
	{
		id: 'meherpur',
		name: 'Meherpur',
		nameLocal: 'মেহেরপুর',
		division: 'Khulna',
		latitude: 23.7622,
		longitude: 88.6318,
		popularity: 26
	},
	{
		id: 'patuakhali',
		name: 'Patuakhali',
		nameLocal: 'পটুয়াখালী',
		division: 'Barishal',
		latitude: 22.3596,
		longitude: 90.3298,
		popularity: 38
	},
	{
		id: 'bhola',
		name: 'Bhola',
		nameLocal: 'ভোলা',
		division: 'Barishal',
		latitude: 22.6859,
		longitude: 90.6482,
		popularity: 32
	},
	{
		id: 'pirojpur',
		name: 'Pirojpur',
		nameLocal: 'পিরোজপুর',
		division: 'Barishal',
		latitude: 22.5841,
		longitude: 89.972,
		popularity: 28
	},
	{
		id: 'barguna',
		name: 'Barguna',
		nameLocal: 'বরগুনা',
		division: 'Barishal',
		latitude: 22.0953,
		longitude: 90.1121,
		popularity: 26
	},
	{
		id: 'jhalokati',
		name: 'Jhalokati',
		nameLocal: 'ঝালকাঠি',
		division: 'Barishal',
		latitude: 22.6406,
		longitude: 90.1987,
		popularity: 24
	},
	{
		id: 'noakhali',
		name: 'Noakhali',
		nameLocal: 'নোয়াখালী',
		division: 'Chattogram',
		latitude: 22.8696,
		longitude: 91.0995,
		popularity: 46
	},
	{
		id: 'feni',
		name: 'Feni',
		nameLocal: 'ফেনী',
		division: 'Chattogram',
		latitude: 23.0159,
		longitude: 91.3976,
		popularity: 44
	},
	{
		id: 'lakshmipur',
		name: 'Lakshmipur',
		nameLocal: 'লক্ষ্মীপুর',
		division: 'Chattogram',
		latitude: 22.9447,
		longitude: 90.8282,
		popularity: 32
	},
	{
		id: 'chandpur',
		name: 'Chandpur',
		nameLocal: 'চাঁদপুর',
		division: 'Chattogram',
		latitude: 23.2333,
		longitude: 90.6712,
		popularity: 38
	},
	{
		id: 'brahmanbaria',
		name: 'Brahmanbaria',
		nameLocal: 'ব্রাহ্মণবাড়িয়া',
		division: 'Chattogram',
		latitude: 23.9571,
		longitude: 91.1115,
		popularity: 40
	},
	{
		id: 'rangamati',
		name: 'Rangamati',
		nameLocal: 'রাঙ্গামাটি',
		division: 'Chattogram',
		latitude: 22.6533,
		longitude: 92.1735,
		popularity: 42
	},
	{
		id: 'bandarban',
		name: 'Bandarban',
		nameLocal: 'বান্দরবান',
		division: 'Chattogram',
		latitude: 22.1953,
		longitude: 92.2184,
		popularity: 44
	},
	{
		id: 'khagrachhari',
		name: 'Khagrachhari',
		nameLocal: 'খাগড়াছড়ি',
		division: 'Chattogram',
		latitude: 23.1193,
		longitude: 91.9847,
		popularity: 38
	},
	{
		id: 'moulvibazar',
		name: 'Moulvibazar',
		nameLocal: 'মৌলভীবাজার',
		division: 'Sylhet',
		latitude: 24.4829,
		longitude: 91.7774,
		popularity: 44
	},
	{
		id: 'habiganj',
		name: 'Habiganj',
		nameLocal: 'হবিগঞ্জ',
		division: 'Sylhet',
		latitude: 24.3745,
		longitude: 91.4155,
		popularity: 36
	},
	{
		id: 'sunamganj',
		name: 'Sunamganj',
		nameLocal: 'সুনামগঞ্জ',
		division: 'Sylhet',
		latitude: 25.0658,
		longitude: 91.395,
		popularity: 38
	},
	{
		id: 'netrokona',
		name: 'Netrokona',
		nameLocal: 'নেত্রকোণা',
		division: 'Mymensingh',
		latitude: 24.8103,
		longitude: 90.7299,
		popularity: 30
	},
	{
		id: 'jamalpur',
		name: 'Jamalpur',
		nameLocal: 'জামালপুর',
		division: 'Mymensingh',
		latitude: 24.9375,
		longitude: 89.937,
		popularity: 34
	},
	{
		id: 'sherpur',
		name: 'Sherpur',
		nameLocal: 'শেরপুর',
		division: 'Mymensingh',
		latitude: 25.0205,
		longitude: 90.0153,
		popularity: 28
	},
	{
		id: 'kishoreganj',
		name: 'Kishoreganj',
		nameLocal: 'কিশোরগঞ্জ',
		division: 'Dhaka',
		latitude: 24.4449,
		longitude: 90.7766,
		popularity: 34
	},
	{
		id: 'manikganj',
		name: 'Manikganj',
		nameLocal: 'মানিকগঞ্জ',
		division: 'Dhaka',
		latitude: 23.8617,
		longitude: 90.0003,
		popularity: 28
	},
	{
		id: 'munshiganj',
		name: 'Munshiganj',
		nameLocal: 'মুন্সিগঞ্জ',
		division: 'Dhaka',
		latitude: 23.5422,
		longitude: 90.5305,
		popularity: 26
	},
	{
		id: 'narsingdi',
		name: 'Narsingdi',
		nameLocal: 'নরসিংদী',
		division: 'Dhaka',
		latitude: 23.9322,
		longitude: 90.715,
		popularity: 30
	},
	{
		id: 'rajbari',
		name: 'Rajbari',
		nameLocal: 'রাজবাড়ী',
		division: 'Dhaka',
		latitude: 23.7574,
		longitude: 89.6444,
		popularity: 26
	},
	{
		id: 'shariatpur',
		name: 'Shariatpur',
		nameLocal: 'শরীয়তপুর',
		division: 'Dhaka',
		latitude: 23.2423,
		longitude: 90.4348,
		popularity: 24
	},
	{
		id: 'madaripur',
		name: 'Madaripur',
		nameLocal: 'মাদারীপুর',
		division: 'Dhaka',
		latitude: 23.1641,
		longitude: 90.1897,
		popularity: 26
	},
	{
		id: 'gopalganj',
		name: 'Gopalganj',
		nameLocal: 'গোপালগঞ্জ',
		division: 'Dhaka',
		latitude: 23.005,
		longitude: 89.8266,
		popularity: 28
	}
];
