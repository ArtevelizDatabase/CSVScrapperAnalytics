document.addEventListener("DOMContentLoaded", () => {
  console.log("Enhanced Application starting...")

  // Global variables
  let csvFileInput = null
  let loadSampleDataBtn = null
  let rawParsedData = []
  let currentFilteredData = []
  let currentPage = 1
  const ITEMS_PER_PAGE = 48

  // DOM elements
  const fileInfoDiv = document.getElementById("fileInfo")
  const fileNameSpan = document.getElementById("fileName")
  const fileSizeSpan = document.getElementById("fileSize")
  const headerStatsDiv = document.getElementById("headerStats")
  const totalRecordsSpan = document.getElementById("totalRecords")
  const totalProductsSpan = document.getElementById("totalProducts")
  const totalCategoriesSpan = document.getElementById("totalCategories")

  const statisticsSection = document.getElementById("statisticsSection")
  const previewSection = document.getElementById("previewSection")
  const filtersSection = document.getElementById("filtersSection")
  const visualizationsSection = document.getElementById("visualizationsSection")
  const paginationControlsDiv = document.getElementById("paginationControls")

  const statusFilterSelect = document.getElementById("statusFilter")
  const productFilterInput = document.getElementById("productFilter")
  const categoryFilterInput = document.getElementById("categoryFilter")
  const applyFiltersButton = document.getElementById("applyFiltersButton")
  const resetFiltersButton = document.getElementById("resetFiltersButton")

  // Chart instances
  const chartInstances = {
    topUsers: null,
    topProductTitles: null,
    userPercentage: null,
    uniqueProducts: null,
    status: null,
    categories: null,
  }

  // Constants
  const SAMPLE_DATA_URL =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/envato-2025-05-27-SB4jvD4mJz5pnAiCbWB2WHml5o9f28.csv"

  const RAINBOW_PALETTE = ["#163b82","#b2e3fa","#c9f5cc","#f8c9d2","#d6d6fa","#54dacb","#fd6f73","#6ed3f3","#fcb845","#8676f9","#fd9b36","#a24dff","#fd6d6d","#5bcbfa","#e0e0e0"];


  // Categories and themes mapping
const categoriesMap = {
    "Social Media": [
      "instagram", "facebook", "social media", "story", "feed", "cover", "youtube", "thumbnail", "carousel"
    ],
    "Presentation": [
      "presentation", "powerpoint", "keynote", "Google slide", "Google slides", "slides", "Power Point",  "Google slide",
    ],
    // Kategori Cetak yang dipecah:
    "Flyer & Poster": [
      "flyer", "poster", "leaflet", "flyer set", "poster set"
    ],
    "Brochure": [
      "brochure", "catalog", "magazine", "book", "trifold", "catalogue"
    ],
    "Business Page": [
      "letterhead", "stationery", "company profile", "proposal", "envelope", "magazine", "brand guidelines", "corporate identity", "company brochure", "business profile", "identity"
    ],
    "Menu": [
      "menu", "restaurant menu", "cafe menu", "food menu", "drink menu", "menu design"
    ],
    "Ticket": [
      "ticket", "event ticket", "concert ticket", "admission ticket", "entry ticket", "boarding pass", "voucher", "coupon"
    ],
    "Business Card": [
      "business card", "visiting card", "name card", "contact card", "calling card"
    ],
    "Letterhead": [
      "letterhead", "company letterhead", "corporate letterhead", "business letterhead", "official letterhead"
    ],
    "Invoice": [
      "invoice", "bill", "receipt", "payment request", "sales invoice", "purchase invoice"
    ],
    "card": [
      "card", "greeting card", "birthday card", "invitation card", "thank you card", "business card", "name card", "contact card", "calling card", "postcard", "holiday card", "seasonal card"
    ],
    "Roll Up Banner": [
      "Roll Up Banner", "roll-up banner", "pull-up banner", "retractable banner", "pop-up banner", "display banner", "standee"
    ],
    "Certificate": [
      "certificate", "award", "achievement", "recognition", "diploma", "degree", "completion certificate", "training certificate",
    ],
    "Resume": [
      "cv", "resume", "curriculum vitae", "job application", "job resume", "job cv", "cv resume"
    ],

    // Kategori lainnya tetap sama:
    "Web & UI/UX": [
      "web", "website", "landing page", "ui", "ux", "interface", "dashboard", "app", "mobile app", "ui kit", "email newsletter", "hero section", "hero page",
    ],
    "Mockup": [
      "mockup", "mockups", "mock-up", "display", "showcase", "scene creator", "packaging", "device", "apparel", "stationery", "signage"
    ],
    "Infographic": [
      "infographic", "chart", "data visualization", "diagram", "timeline"
    ],
    "Illustration & Icon": [
      "illustration", "icon", "vector", "graphic", "drawing"
    ],
    "Text Effect": [
      "Text Effect", "Text Effects",
    ],
    "Font": [
      "font", "typeface", "typography"
    ],
    "Add-on & Plugin": [
      "add-on", "plugin", "preset", "action", "brush"
    ],

  };


  const themeKeywords = {
    "Seasonal & Holiday": [
    "new year", "new year's day", "lunar new year", "chinese new year", "christmas", "christmas eve", "kwanzaa", "hanukkah", "diwali", "eid al-fitr", "eid al-adha", "ramadan", "holi", "purim", "epiphany", "orthodox christmas", "groundhog day", "mardi gras", "ash wednesday", "easter", "passover", "good friday", "holy thursday", "halloween", "thanksgiving", "black friday", "cyber monday", "boxing day", "valentine's day", "galentine's day", "singles awareness day", "st. patrick's day", "yule", "samhain", "carnival", "midsummer", "day of the dead", "cherry blossom", "oktoberfest", "spring equinox", "summer solstice", "autumnal equinox", "winter solstice", "season's greetings", "holiday greetings", "festive", "festivities", "new year resolutions"
  ],
  "Family & Relationship": [
    "mother's day", "father's day", "parents' day", "grandparents' day", "national siblings day", "national son and daughter day", "national girlfriend day", "national boyfriend day", "national spouses day", "husband appreciation day", "wife appreciation day", "family day", "national best friends day", "international friendship day", "love", "romance", "family reunion", "engagement", "wedding", "anniversary", "birthday", "baby shower", "new baby", "graduation", "class reunion"
  ],
  "National & Patriotic": [
    "independence day", "national day", "veterans day", "remembrance day", "flag day", "patriot day", "juneteenth", "martin luther king day", "presidents' day", "labor day", "anzac day", "bastille day", "canada day", "king's day", "national day of mourning", "armed forces day", "memorial day", "pearl harbor remembrance day", "national heroes day", "national anthem day", "republic day", "freedom day"
  ],
  "Awareness & Cause": [
    "earth day", "world cancer day", "international women's day", "black history month", "lgbt history month", "pride month", "world aids day", "international holocaust remembrance day", "autism awareness day", "world health day", "world environment day", "world blood donor day", "world oceans day", "world refugee day", "world mental health day", "breast cancer awareness month", "movember", "world animal day", "human rights day", "world day against child labor", "world population day", "international day of peace", "international day of persons with disabilities", "world diabetes day", "world pneumonia day", "transgender day of remembrance", "world no tobacco day", "animal welfare", "humanitarian", "charity", "social justice", "equality", "diversity", "inclusion", "sustainability", "climate change", "conservation"
  ],
  "Food & Drink": [
    "national spaghetti day", "national buffet day", "national chocolate covered cherry day", "national carrot cake day", "national pizza day", "national pancake day", "national margarita day", "national chipotle day", "national coffee day", "national hot chocolate day", "national ice cream day", "national donut day", "national chocolate day", "national pie day", "national cheeseburger day", "world chocolate day", "national burger day", "national croissant day", "national beer day", "national wine day", "national tequila day", "menu", "restaurant", "cafe", "food", "drink", "cocktail", "cuisine", "dessert", "recipe", "cooking", "eating", "foodie", "restaurant week"
  ],
  "Sports & Fitness": [
    "super bowl", "world cup", "olympics", "national sports day", "global running day", "international yoga day", "go skateboarding day", "golf", "basketball", "soccer", "football", "baseball", "tennis", "swimming", "gym", "workout", "fitness", "healthy living", "marathon", "cycling", "hiking", "active lifestyle"
  ],
  "Education & Learning": [
    "back to school", "teacher appreciation day", "world teachers’ day", "international literacy day", "international day of education", "read across america", "national houseplant appreciation day", "national human trafficking awareness day", "world science day", "museum selfie day", "library snapshot day", "school", "university", "college", "learning", "books", "reading", "study", "student", "teacher", "academic"
  ],
  "Animal & Pet": [
    "national bird day", "national hug your cat day", "national dog day", "national pet day", "world animal day", "penguin awareness day", "national squirrel appreciation day", "world elephant day", "international cat day", "national rescue dog day", "national black cat appreciation day", "pets", "animals", "wildlife", "cats", "dogs", "birds", "fish", "zoo", "veterinary"
  ],
  "Career & Business": [
    "employee appreciation day", "national boss's day", "administrative professionals day", "national entrepreneurs' day", "job action day", "work", "office", "professional", "corporate", "teamwork", "productivity", "management", "career fair", "networking"
  ],
  "Arts & Culture": [
    "world art day", "international jazz day", "world theatre day", "world poetry day", "international music day", "world book day", "world photography day", "museum day", "gallery", "exhibition", "performance", "music", "dance", "film", "literature", "history", "culture", "heritage", "art", "creative"
  ],
  "Nature & Environment": [
    "world water day", "world wildlife day", "international day of forests", "world meteorological day", "world oceans day", "national park service founders day", "world rainforest day", "world coral reef day", "nature", "environment", "ecology", "green", "sustainability", "outdoor", "landscape", "flowers", "trees", "gardening", "recycling", "pollution", "climate"
  ],
  "Quirky & Fun": [
    "national nothing day", "national cheese lovers day", "national hug day", "national bubble bath day", "national chocolate mint day", "national margarita day", "national pie day", "national compliment day", "national peanut butter day", "national fun at work day", "opposite day", "national bubble wrap appreciation day", "national lego day", "national puzzle day", "national hangover day", "world introvert day", "national spaghetti day", "national sci-fi day", "national trivia day", "national whipped cream day", "national thank god it's monday day", "national cuddle up day", "national bobblehead day", "national houseplant appreciation day", "national bittersweet chocolate day", "national clean off your desk day", "national marzipan day", "national gluten-free day", "national dress up your pet day", "national hat day", "national bagel day", "national strawberry ice cream day", "national popcorn day", "national thesaurus day", "national hug your dog day", "national pancake day", "national hot dog day", "national chocolate chip cookie day", "national watermelon day", "lazy day", "tell a joke day", "national rum day", "left-handers day", "national filet mignon day", "national waffle day", "national pizza party day", "national brother's day", "national scavenger hunt day", "national wine day", "national burger day", "national brisket day", "national paper airplane day", "national redhead day", "national suncreen day", "national smile day", "world no tobacco day", "national pig day", "national wedding planning day", "peace corps day", "national horse protection day", "national peanut butter lover's day", "self-injury awareness day", "zero discrimination day", "world music therapy day", "world candle day", "baby sleep day", "international ideas month", "sleep awareness month", "national minnesota day", "texas independence day", "read across america", "world teen mental wellness day", "casimir pulaski day", "missouri compromise", "national anthem day", "world hearing day", "world birth defects day", "what if cats and dogs had opposable thumbs day", "national grammar day", "world obesity day", "national hug a g.i. day", "paczki day", "organize your home office day", "cinco de marcho", "national dentists day", "dred scott case", "national dress day", "national oreo cookie day", "national white chocolate cheesecake day", "national cereal day", "national day of unplugging", "national be heard day", "world plant power day", "national dress in blue day", "denim day for dementia", "national proofreading day", "international fanny pack day", "national peanut cluster day", "national barbie day", "national meatball day", "daylight saving time starts", "national get over it day", "national napping day", "national mario day", "national pack your lunch day", "harriet tubman day", "national promposal day", "national girl scout day", "national plant a flower day", "national k9 veterans day", "world kidney day", "national good samaritan day", "national popcorn lover's day", "pi day", "international day of mathematics", "national potato chip day", "white day", "national corn dog day", "world consumer rights day", "true confessions day", "the ides of march", "national poison prevention week", "evacuation day", "awkward moments day", "national biodiesel day", "world social work day", "st. joseph's day", "national let's laugh day", "international read to me day", "national chocolate caramel day", "certified nurses day", "national proposal day", "international day of happiness", "national kick butts day", "world oral health day", "french language day", "alien abductions day", "national fragrance day", "national flower day", "world down syndrome day", "international day of forests", "national common courtesy day", "national french bread day", "world puppetry day", "international day for the elimination of racial discrimination", "national goof off day", "national puppy day", "world meteorological day", "national near miss day", "national tamale day", "national chip and dip day", "national cocktail day", "national cheesesteak day", "world tuberculosis day", "national chocolate covered raisin day", "maryland day", "national medal of honor day", "international waffle day", "national physician's week", "national spinach day", "purple day", "prince kuhio day", "national joe day", "international whiskey day", "world theatre day", "respect your cat day", "earth hour", "national smoke and mirrors day", "national mom and pop business owners day", "national doctors' day", "eid al-fitr", "national i am in control day", "last day of ramadan", "césar chávez day", "world backup day", "national crayon day", "trans day of visibility", "national sourdough bread day", "international fun at work day", "take down tobacco national day of action", "boomer bonus day", "edible book day", "fossil fools day", "international tatting day", "library snapshot day", "lupus alert day", "mathematics and statistics awareness month", "national fun day", "child abuse awareness month", "parkinson’s disease awareness month", "international children's book day", "national walking day", "national peanut butter and jelly day", "national reconciliation day", "autism acceptance day", "international fact checking day", "national diy day", "national ferret day", "national burrito day", "world party day", "national find a rainbow day", "don't go to work unless it's fun day", "national tweed day", "national rainbow day", "national chocolate mousse day", "national school librarian day", "international carrot day", "national hug a newsman day", "walk around things day", "world rat day", "national handmade day", "national love our children day", "gold star spouses day", "international pillow fight day", "national dandelion day", "national deep dish pizza day", "international day of sport for development and peace", "national tartan day", "national student-athlete day", "plan your epitaph day", "national caramel popcorn day", "national no housework day", "community garden week", "national former prisoner of war recognition day", "national name yourself day", "world homeopathy day", "national alcohol screening day", "national pet day", "day of silence", "national submarine day", "american civil war", "national grilled cheese sandwich day", "hanuman jayanti", "national licorice day", "cosmonautics day", "palm sunday", "thomas jefferson's birthday", "national scrabble day", "national make lunch count day", "international plant appreciation day", "national peach cobbler day", "ambedkar jayanti", "international moment of laughter day", "rainn day", "national ex-spouse day", "national gardening day", "national pan american day", "baisakhi", "national dolphin day", "national pecan day", "bengali new year", "tax day", "assassination of abraham lincoln", "father damien day", "national laundry day", "world art day", "jackie robinson day", "national pajama day", "emancipation day", "selena day", "world voice day", "national high five day", "world hemophilia day", "maundy thursday", "international bat appreciation day", "blah blah blah day", "national cheeseball day", "world heritage day", "national haiku poetry day", "national lineman appreciation day", "national columnists’ day", "world amateur radio day", "husband appreciation day", "holy saturday", "national look alike day", "chinese language day", "easter monday", "san jacinto day", "spanish american war", "international creativity and innovation day", "national kindergarten day", "dyngus day", "national chocolate covered cashews day", "international mother earth day", "national jelly bean day", "lover's day", "national picnic day", "national take a chance day", "yom hashoah", "national talk like shakespeare day", "english language day", "spanish language day", "saint george's day", "take our daughters and sons to work day", "world immunization week", "national pig in a blanket day", "national dna day", "world penguin day", "arbor day", "national telephone day", "world malaria day", "parental alienation awareness day", "pretzel day", "national rebuilding day", "international sculpture day", "world intellectual property day", "international chernobyl disaster remembrance day", "hug an australian day", "national pretzel day", "world veterinary day", "confederate memorial day", "morse code day", "national superhero day", "national great poetry reading day", "workers’ memorial day", "world day for safety and health at work", "international dance day", "national shrimp scampi day", "yom hazikaron", "international jazz day", "honesty day", "international guide dog day", "school principals’ day", "global love day", "world password day", "loyalty day", "law day", "national day of prayer", "lei day", "haitian heritage month", "marshall islands constitution day", "national chocolate parfait day", "national no pants day", "national space day", "international harry potter day", "world tuna day", "national truffle day", "astronomy day", "national two different colored shoes day", "kentucky derby", "world press freedom day", "national explosive ordnance disposal day", "national paranormal day", "join hands day", "free comic book day", "national montana day", "national lemonade day", "star wars day", "kent state shootings", "haymarket riot", "rhode island independence day", "world laughter day", "african world heritage day", "international day of the midwife", "world portuguese language day", "teacher appreciation week", "national nurses day", "teacher’s day", "international no diet day", "national tourist appreciation day", "national foster care day", "victory in europe day", "truman day", "world red cross day", "national have a coke day", "national student nurse day", "international thalassaemia day", "military spouse appreciation day", "national provider day", "national lost sock memorial day", "national clean your room day", "world lupus day", "fair trade day", "world migratory bird day", "national golf day", "national shrimp day", "national eat what you want day", "pullman strike", "international women in mathematics day", "national limerick day", "national third shift workers day", "international nurses day", "yom ha'atzmaut", "national apple pie day", "world cocktail day", "jamestown colony founded", "national receptionists day", "national dance like a chicken day", "national chocolate chip day", "peace officers memorial day", "international day of families", "malcolm x day", "endangered species day", "international day of light", "bike-to-work day", "preakness stakes", "national learn to swim day", "world hypertension day", "world whisky day", "world baking day", "international museum day", "national no dirty dishes day", "haitian flag day", "homestead act", "national be a millionaire day", "world bee day", "national defense transportation day", "international tea day", "world day for cultural diversity for dialogue and development", "national waitstaff day", "national talk like yoda day", "national memo day", "harvey milk day", "international day for biological diversity", "national maritime day", "world goth day", "world turtle day", "national brother's day", "world schizophrenia day", "towel day", "national wine day", "national missing children’s day", "yom yerushalayim", "memorial day", "national paper airplane day", "world redhead day", "national sunscreen day", "national burger day", "national brisket day", "world blood cancer day", "menstrual hygiene day", "ascension day", "learn about composting day", "international day of united nations peacekeepers", "red nose day", "national creativity day", "world multiple sclerosis day", "national smile day", "world no tobacco day", "national red rose day", "national pen pal day", "shavuot", "global day of parents", "world reef awareness day", "national cancer survivor’s day", "national say something nice day", "national dairy month", "dare day", "national skincare day", "jefferson davis' birthday", "leave the office early day", "american indian citizenship day", "national bubba day", "national i love my dentist day", "national leave the office early day", "national rocky road day", "national rotisserie chicken day", "world bicycle day", "national egg day", "repeat day", "national simp day", "national cheese day", "national hug your cat day", "global running day", "world environment day", "national gingerbread day", "ganga dussehra", "day of arafah", "national higher education day", "d-day anniversary", "national donut day", "eid al-adha", "national drive-in movie day", "belmont stakes", "national vcr day", "world food safety day", "national chocolate ice-cream day", "national trails day", "pentecost", "national best friends day", "world oceans day", "odunde festival", "national children’s day", "national donald duck day", "whit monday", "national iced tea day", "national call your doctor day", "national ballpoint pen day", "national egg roll day", "kamehameha day", "national corn on the cob day", "national loving day", "world day against child labor", "national sewing machine day", "international albinism awareness day", "world softball day", "national weed your garden day", "bourbon day", "flag day", "army birthday", "world blood donor day", "global wellness day", "father's day", "trinity sunday", "world elder abuse awareness day", "nature photography day", "national fudge day", "bloomsday", "international day of the african child", "national take your cat to work day", "national mascot day", "bunker hill day", "world day to combat desertification and drought", "national eat your vegetables day", "international picnic day", "international sushi day", "international panic day", "juneteenth", "national garfield the cat day", "national martini day", "corpus christi", "world sauntering day", "ugliest dog day", "summer solstice", "west virginia day", "american eagle day", "take your dog to work day", "world refugee day", "international surfing day", "take a road trip day", "national selfie day", "go skateboarding day", "international yoga day", "national daylight appreciation day", "world juggling day", "national onion ring day", "national limoncello day", "world rainforest day", "national pink day", "national hydration day", "international women in engineering day", "national typewriter day", "national let it go day", "national swim a lap day", "battle of the little bighorn", "korean war", "bourdain day", "global beatles day", "islamic new year", "muharram", "national work from home day", "national handshake day", "national chocolate pudding day", "helen keller day", "national bingo day", "national ptsd awareness day", "national sunglasses day", "national hiv testing day", "micro-, small and medium-sized enterprises day", "international pineapple day", "national onion day", "national insurance awareness day", "tau day", "national camera day", "hug holiday", "international mud day", "world social media day", "international asteroid day", "please take my children to work day", "national meteor watch day", "world bronchiectasis day", "canada day", "international joke day", "battle of gettysburg", "national postal worker day", "bobby bonilla day", "civil rights act", "world ufo day", "national wildland firefighter day", "i forgot day", "national stay out of the sun day", "international plastic bag free day", "national compliment your mirror day", "st thomas day", "independence day", "national sidewalk egg frying day", "national bikini day", "national workaholics day", "international day of cooperatives", "international kissing day", "national fried chicken day", "world chocolate day", "global forgiveness day", "national love your skin day", "national raspberry day", "national video game day", "cow appreciation day", "national kitten day", "world population day", "world essential oils day", "national simplicity day", "malala day", "orangemen's day", "national french fry day", "bastille day", "national mac and cheese day", "pandemonium day", "international town criers day", "national give something away day", "national clean beauty day", "blackcurrant day", "national hot dog day", "national cherry day", "world snake day", "national lottery day", "world emoji day", "nelson mandela international day", "world listening day", "seneca falls convention", "national moon day", "moon landing anniversary", "national ice cream day", "international chess day", "world jump day", "national junk food day", "national hammock day", "national gorgeous grandma day", "national tequila day", "pioneer day", "cousins day", "national drive-thru day", "international self care day", "national hire a veteran day", "christmas in july", "uncle and aunt day", "parents' day", "national scotch day", "national creme brûlée day", "national disability independence day", "national milk chocolate day", "bonus army", "world war i", "national lasagna day", "national chicken wing day", "national rain day", "nasa is founded", "national lipstick day", "international tiger day", "national cheesecake day", "international friendship day", "national father-in-law day", "world day against trafficking in persons", "national avocado day", "national intern day", "world ranger day", "national girlfriend day", "colorado day", "national minority donor awareness day", "world scout scarf day", "international childfree day", "world lung cancer day", "international beer day", "lammas day", "tisha b'av", "national ex-girlfriend day", "national watermelon day", "sisters' day", "national friendship day", "american family day", "national chocolate chip cookie day", "coast guard birthday", "barack obama's birthday", "hiroshima day", "purple heart day", "national lighthouse day", "international cat day", "international infinity day", "national book lovers day", "international day of the world's indigenous people", "national bowling day", "national garage sale day", "international coworking day", "lazy day", "national spoil your dog day", "victory day", "national son and daughter day", "middle child day", "international youth day", "national vinyl record day", "national filet mignon day", "national financial awareness day", "world lizard day", "national relaxation day", "assumption of mary", "hawaii statehood day", "international homeless animals day", "national back to school prep day", "tell a joke day", "national rum day", "national bratwurst day", "bennington battle day", "janmashtami", "national roller coaster day", "national airborne day", "international geocaching day", "national black cat appreciation day", "national thrift shop day", "national nonprofit day", "national couple's day", "national fajita day", "national potato day", "national aviation day", "world humanitarian day", "world photography day", "national radio day", "world mosquito day", "national chocolate pecan pie day", "feast day of st bernard", "senior citizens day", "international day of remembrance and tribute to the victims of terrorism", "national spumoni day", "national tooth fairy day", "world plant milk day", "be an angel day", "folklore day", "cheap flight day", "national sponge cake day", "international day for the remembrance of the slave trade and its abolition", "ride like the wind day", "national waffle day", "kobe bryant day", "international strange music day", "pluto demoted day", "national kiss and make up day", "national secondhand wardrobe day", "national park service founders day", "women's equality day", "national webmistress day", "national dog day", "ganesh chaturthi", "national just because day", "march on washington", "rainbow bridge remembrance day", "bow tie day", "national lemon juice day", "national chop suey day", "international day against nuclear tests", "national beach day", "college colors day", "international day of the victims of enforced disappearance", "national grief awareness day", "world distance learning day", "international overdose awareness day", "eat outside day", "labor day", "american chess day", "west indian day parade", "emma m nutt day", "world letter writing day", "world alzheimer's month", "national chicken month", "national suicide prevention month", "v-j day", "telephone tuesday", "world coconut day", "bison ten yell day", "signing of the treaty of paris", "national skyscraper day", "national wildlife day", "world sexual health day", "eat an extra dessert day", "national lazy mom’s day", "international day of charity", "national 401(k) day", "national cheese pizza day", "national food bank day", "national be late for something day", "world samosa day", "bring your manners to work day", "read a book day", "world beard day", "fight procrastination day", "national salami day", "international day of clean air for blue skies", "national beer lover's day", "national neither snow nor rain day", "world physiotherapy day", "worldwide cystic fibrosis day", "pardon day", "star trek day", "international sudoku day", "california admission day", "international day to protect education from attack", "national teddy bear day", "world suicide prevention day", "national swap ideas day", "international makeup day", "patriot day", "national make your bed day", "national school picture day", "national hot cross bun day", "national video games day", "national day of civic hacking", "national day of encouragement", "international day for south-south cooperation", "national chocolate milkshake day", "positive thinking day", "roald dahl day", "carl garner federal lands cleanup day", "international chocolate day", "national peanut day", "national celiac disease awareness day", "national pet memorial day", "national bald is beautiful day", "day of the programmer", "world sepsis day", "grandparents' day", "national live creative day", "national hug your hound day", "national sober day", "world lymphoma awareness day", "international day of democracy", "get ready day", "national online learning day", "national linguine day", "international dot day", "national hispanic heritage month", "national double cheeseburger day", "national guacamole day", "national step family day", "national working parents day", "national it professionals day", "international day for the preservation of the ozone layer", "constitution day", "citizenship day", "international country music day", "world patient safety day", "national pet bird day", "time's up day", "national first love day", "national cheeseburger day", "international equal pay day", "air force day", "hug a greeting card writer day", "national dance day", "national pow/mia recognition day", "talk like a pirate day", "national pepperoni pizza day", "national fried rice day", "locate an old friend day", "national cleanup day", "national gymnastics day", "national queso day", "batman day", "international coastal cleanup day", "international eat an apple day", "big whopper liar day", "world gratitude day", "wife appreciation day", "international day of peace", "world alzheimer’s day", "national chai day", "national white chocolate day", "falls prevention awareness day", "autumnal equinox", "hobbit day", "world car-free day", "national elephant appreciation day", "national family day", "american business women’s day", "national centenarian’s day", "car free day", "world rhino day", "world cml day", "world rose day", "dear diary day", "national girls’ night in day", "national voter registration day", "international day of sign languages", "bi visibility day", "national dogs in politics day", "rosh hashanah", "national punctuation day", "schwenkfelder thanksgiving", "national brave day", "national cherries jubilee day", "world bollywood day", "world gorilla day", "comic book day", "national cooking day", "national lobster day", "national daughters day", "national one-hit wonder day", "world dream day", "national open the magic day", "national dumpling day", "national love note day", "johnny appleseed day", "international day for the total elimination of nuclear weapons", "world contraception day", "native american day", "national crush day", "national family health & fitness day usa", "national ghost hunting day", "national singles day", "world tourism day", "national hunting and fishing day", "national public lands day", "international rabbit day", "gold star mother's day", "national neighbor day", "national sons day", "world rabies day", "ask a stupid question day", "international daughters day", "international day for universal access to information", "world rivers day", "national coffee day", "world heart day", "national starbucks day", "international day of awareness of food loss and waste", "veterans of foreign wars day", "international food loss and waste awareness day", "international podcast day", "national love people day", "international translation day", "world maritime day", "national day for truth and reconciliation", "international coffee day", "world vegetarian day", "yom kippur", "international music day", "national homemade cookies day", "national hair day", "national walk and bike to school day", "international day of older persons", "national fire pup day", "world financial planning day", "random acts of poetry day", "urticaria day", "breast cancer awareness month", "national kale day", "national custodian day", "national name your car day", "international day of non-violence", "vijaya dashami", "national boyfriend day", "world smile day", "world temperance day", "mean girls day", "national body language day", "national taco day", "national vodka day", "feast of st francis of assisi", "world animal day", "national cinnamon roll day", "national golf lovers day", "world space week", "national get funky day", "national do something nice day", "world teachers’ day", "national coaches day", "sukkot", "child health day", "national noodle day", "national plus size appreciation day", "world cerebral palsy day", "world habitat day", "world architecture day", "world cotton day", "national frappe day", "national inner beauty day", "national emergency nurses day", "national stop bullying day", "national depression screening day", "international podiatry day", "leif erikson day", "world post day", "world sight day", "world egg day", "world day against the death penalty", "world mental health day", "world homeless day", "national coming out day", "world hospice and palliative care day", "national chess day", "international day of the girl child", "farmers day", "national savings day", "world arthritis day", "columbus day", "national train your brain day", "native americans' day", "navy birthday", "national no bra day", "international day for disaster risk reduction", "shemini atzeret", "world thrombosis day", "national dessert day", "ada lovelace day", "national fossil day", "world standards day", "national medical assistants day", "white cane safety day", "national grouch day", "global handwashing day", "national mushroom day", "international day of rural women", "global dignity day", "world food day", "national sports day", "boss's day", "dictionary day", "global cat day", "department store day", "world spine day", "national pasta day", "international day for the eradication of poverty", "national pay back a friend day", "national mammography day", "black poetry day", "world trauma day", "national chocolate cupcake day", "sweetest day", "alaska day", "national fetch day", "national no beard day", "world okapi day", "international archaeology day", "dhanteras", "national kiss your crush day", "national new friends day", "national day on writing", "world osteoporosis day", "international sloth day", "national clean your virtual desktop day", "national pharmacy technician day", "national youth confidence day", "international chefs day", "world statistics day", "international day of the air traffic controller", "national reptile day", "national pets for veterans day", "diwali", "national apple day", "back to the future day", "national nut day", "international stuttering awareness day", "national paralegal day", "national tv talk show host", "stock market crash", "united nations day", "national bologna day", "world development information day", "world polio day", "world pasta day", "international dwarfism awareness day", "world opera day", "international artist day", "national art day", "national i care about you day", "national make a difference day", "national pumpkin day", "national day of the deployed", "national mother-in-law day", "national black cat day", "world occupational therapy day", "national mentoring day", "national american beer day", "world day for audiovisual heritage", "national chocolate day", "national immigrants day", "national first responders day", "international animation day", "world judo day", "internet day", "national cat day", "national oatmeal day", "world psoriasis day", "world stroke day", "national text your ex day", "national checklist day", "national candy corn day", "halloween", "nevada day", "national breadstick day", "national magic day", "world cities day", "national caramel apple day", "world savings day", "samhain", "national calzone day", "world vegan day", "national brush day", "all saints' day", "day of the dead", "no shave november", "native american heritage month", "national adoption month", "movember", "national author's day", "national scented candle day", "daylight saving time ends", "all souls' day", "new york city marathon", "international day to end impunity for crimes against journalists", "national homemaker day", "national sandwich day", "job action day", "recreation day", "national candy day", "melbourne cup", "iran hostage crisis", "national chicken lady day", "world tsunami awareness day", "american football day", "national redhead day", "national stress awareness day", "kartik purnima", "national men make dinner day", "national nachos day", "international day for preventing the exploitation of the environment in war and armed conflict", "national canine lymphoma awareness day", "national cappuccino day", "national stem/steam day", "world urbanism day", "world freedom day", "go to an art museum day", "world adoption day", "international day against fascism and antisemitism", "marine corps birthday", "international accounting day", "world science day for peace and development", "world keratoconus day", "veterans day", "national sundae day", "national metal day", "singles day", "national happy hour day", "world pneumonia day", "nurse practitioner week", "world kindness day", "sadie hawkins day", "national pickle day", "world diabetes day", "national family pj day", "america recycles day", "national philanthropy day", "national drummer day", "national clean out your refrigerator day", "national fast food day", "international day for tolerance", "national button day", "world day of remembrance for road traffic victims", "national hiking day", "world prematurity day", "national homemade bread day", "national take a hike day", "national unfriend day", "international students' day", "national princess day", "national entrepreneurs' day", "world antimicrobial awareness week", "national macchiato day", "national play monopoly day", "international men's day", "national camp day", "world toilet day", "world copd day", "hanukkah", "future teachers of america day", "transgender day of remembrance", "universal children’s day", "great american smokeout", "national absurdity day", "national rural health day", "world philosophy day", "world pancreatic cancer day", "africa industrialization day", "world television day", "world hello day", "national stuffing day", "national adoption day", "go for a ride day", "national espresso day", "fibonacci day", "national play day with dad", "international day for the elimination of violence against women", "national parfait day", "national cake day", "national family health history day", "national milk day", "thanksgiving day", "national day of mourning", "national french toast day", "black friday", "red planet day", "american indian heritage day", "buy nothing day", "small business saturday", "international day of solidarity with the palestinian people", "international computer security day", "national mason jar day", "national personal space day", "day of remembrance for all victims of chemical warfare", "st andrew's day", "world aids day", "national christmas lights day", "cyber monday", "national eat a red apple day", "international day for the abolition of slavery", "giving tuesday", "national mutt day", "national fritters day", "international day of persons with disabilities", "wildlife conservation day", "international day of banks", "national cookie day", "day of the ninja", "international volunteer day", "national repeal day", "national bartender day", "world soil day", "national comfort food day", "st. nicholas day", "candle day", "national gazpacho day", "national miners day", "world pear day", "national cotton candy day", "pearl harbor remembrance day", "international civil aviation day", "national letter writing day", "green monday", "feast of the immaculate conception", "national brownie day", "national chocolate brownie day", "national pastry day", "national llama day", "international anti-corruption day", "international day of commemoration and dignity of the victims of the crime of genocide", "christmas card day", "human rights day", "dewey decimal system day", "nobel prize day", "international animal rights day", "jane addams day", "international mountain day", "unicef birthday", "feast of our lady of guadalupe", "gingerbread house day", "national poinsettia day", "international day of neutrality", "international universal health coverage day", "national day of the horse", "national guard birthday", "national salesperson day", "national violin day", "national cocoa day", "saint lucy's day", "monkey day", "national free shipping day", "worldwide candle lighting day", "national cupcake day", "bill of rights day", "national wear your pearls day", "las posadas", "national chocolate covered anything day", "wright brothers day", "pan american aviation day", "national maple syrup day", "arabic language day", "national roast suckling pig day", "answer the telephone like buddy the elf day", "national twin day", "international migrants day", "national ugly sweater day", "national hard candy day", "national oatmeal muffin day", "national emo day", "national underdog day", "national sangria day", "international human solidarity day", "national wreaths across america day", "yule", "winter solstice", "national coquito day", "national crossword puzzle day", "national short girl appreciation day", "look on the bright side day", "national french fried shrimp day", "national short person day", "national cookie exchange day", "festivus", "national roots day", "christmas eve", "national eggnog day", "the feast of the seven fishes", "christmas day", "kwanzaa", "no interruptions day", "boxing day", "national fruitcake day", "international day of epidemic preparedness", "national leftovers day", "national chocolate candy day", "national card playing day", "national short film day", "pledge of allegiance day", "national call a friend day", "national download day", "wounded knee", "still need to do day", "national bacon day", "national champagne day", "new year's eve", "national make up your mind day"
  ],
  "T-Shirt & Apparel Design": [
    "t-shirt", "apparel", "clothing", "merchandise", "hoodie", "jersey", "uniform", "fashion", "garment", "wearable"
  ],
  "Packaging Design": [
    "packaging", "box design", "label", "product packaging", "pouch", "bag design", "container", "bottle label", "food packaging"
  ],
  "Signage": [
    "signage", "banner", "outdoor sign", "indoor sign", "billboard", "wayfinding", "storefront", "shop sign", "directional sign", "street sign"
  ],
  "Digital Product": [
    "e-book", "digital planner", "digital journal", "workbook", "template (digital)", "digital download", "online course material", "digital guide"
  ],
  "Pattern & Texture": [
    "pattern", "seamless pattern", "texture", "background", "digital paper", "surface design", "abstract pattern", "textile pattern"
  ],
  // The original "Card" category is now refined to "Card" and specific keywords moved to "Business Card"

  };

  // Initialize the application
  initializeApp()

  function initializeApp() {
    setupThemeToggle()
    setupAccordions()
    setupEventListeners()
    restoreUploadCardUI()
    checkDependencies()
  }

  function setupThemeToggle() {
    const themeToggleBtn = document.getElementById("themeToggleBtn")
    const body = document.body
    const themeIcon = themeToggleBtn.querySelector("i")

    themeToggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode")
      if (body.classList.contains("dark-mode")) {
        themeIcon.classList.remove("fa-moon")
        themeIcon.classList.add("fa-sun")
        localStorage.setItem("theme", "dark")
      } else {
        themeIcon.classList.remove("fa-sun")
        themeIcon.classList.add("fa-moon")
        localStorage.setItem("theme", "light")
      }
      setTimeout(() => {
        if (window.ChartManager && window.ChartManager.regenerateAllCharts) {
          window.ChartManager.regenerateAllCharts()
        }
      }, 200)
    })

    // Load saved theme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      body.classList.add("dark-mode")
      themeIcon.classList.remove("fa-moon")
      themeIcon.classList.add("fa-sun")
    }
  }

  function setupAccordions() {
    const accordions = document.querySelectorAll(".accordion")

    // Setup accordion functionality for vertical layout only
    accordions.forEach((accordion) => {
      const header = accordion.querySelector(".accordion-header")
      if (header) {
        // Remove old listeners by cloning the element
        const newHeader = header.cloneNode(true)
        header.parentNode.replaceChild(newHeader, header)

        // Add new event listener to the cloned header
        newHeader.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()

          const statisticsGrid = document.getElementById("statisticsGrid")

          // Only allow accordion functionality in vertical layout
          if (!statisticsGrid.classList.contains("horizontal-layout")) {
            const thisAccordion = newHeader.closest(".accordion")
            thisAccordion.classList.toggle("active")
            console.log(`Toggled accordion: ${thisAccordion.querySelector("h3").textContent}`)
          }
        })
      }
    })

    // Set initial state based on layout
    setTimeout(() => {
      updateAccordionBehavior()
    }, 100)
  }

  function updateAccordionBehavior() {
    const statisticsGrid = document.getElementById("statisticsGrid")
    const accordions = document.querySelectorAll(".accordion")

    if (statisticsGrid && statisticsGrid.classList.contains("horizontal-layout")) {
      // Horizontal layout: Show all content, disable accordion behavior
      accordions.forEach((accordion) => {
        accordion.classList.add("always-open")
        accordion.classList.remove("active")

        // Hide toggle icon in horizontal layout
        const toggleIcon = accordion.querySelector(".toggle-icon")
        if (toggleIcon) {
          toggleIcon.style.display = "none"
        }

        // Make header non-clickable
        const header = accordion.querySelector(".accordion-header")
        if (header) {
          header.style.cursor = "default"
        }
      })
    } else {
      // Vertical layout: Enable accordion behavior
      accordions.forEach((accordion) => {
        accordion.classList.remove("always-open")
        accordion.classList.add("active") // Auto-expand in vertical

        // Show toggle icon in vertical layout
        const toggleIcon = accordion.querySelector(".toggle-icon")
        if (toggleIcon) {
          toggleIcon.style.display = "block"
        }

        // Make header clickable
        const header = accordion.querySelector(".accordion-header")
        if (header) {
          header.style.cursor = "pointer"
        }
      })
    }
  }

  function setupEventListeners() {
    if (applyFiltersButton) applyFiltersButton.addEventListener("click", applyFilters)
    if (resetFiltersButton) resetFiltersButton.addEventListener("click", resetFilters)

    // Layout toggle functionality
    const layoutToggleBtn = document.getElementById("layoutToggleBtn")
    const statisticsGrid = document.getElementById("statisticsGrid")

    if (layoutToggleBtn && statisticsGrid) {
      layoutToggleBtn.addEventListener("click", () => {
        const isHorizontal = statisticsGrid.classList.contains("horizontal-layout")
        const icon = layoutToggleBtn.querySelector("i")
        const text = layoutToggleBtn.querySelector("span")

        if (isHorizontal) {
          // Switch to vertical layout
          statisticsGrid.classList.remove("horizontal-layout")
          icon.className = "fas fa-th-large"
          text.textContent = "Switch to Horizontal Layout"
          localStorage.setItem("statisticsLayout", "vertical")
        } else {
          // Switch to horizontal layout
          statisticsGrid.classList.add("horizontal-layout")
          icon.className = "fas fa-th-list"
          text.textContent = "Switch to Vertical Layout"
          localStorage.setItem("statisticsLayout", "horizontal")
        }

        // Update accordion behavior after layout change
        setTimeout(() => {
          updateAccordionBehavior()
        }, 100)
      })

      // Load saved layout preference
      const savedLayout = localStorage.getItem("statisticsLayout")
      if (savedLayout === "horizontal") {
        statisticsGrid.classList.add("horizontal-layout")
        layoutToggleBtn.querySelector("i").className = "fas fa-th-list"
        layoutToggleBtn.querySelector("span").textContent = "Switch to Vertical Layout"

        setTimeout(() => {
          updateAccordionBehavior()
        }, 200)
      }
    }
  }

  function checkDependencies() {
    const dependencies = {
      "Papa Parse": !!window.Papa,
      "Chart.js": !!window.Chart,
      "Chart Objects": {
        TopUsersChart: !!window.TopUsersChart,
        TopProductTitlesChart: !!window.TopProductTitlesChart,
        UserPercentageChart: !!window.UserPercentageChart,
        UniqueProductsChart: !!window.UniqueProductsChart,
        StatusChart: !!window.StatusChart,
        CategoriesChart: !!window.CategoriesChart,
      },
    }
    console.log("Dependencies check:", dependencies)
    const allChartObjectsLoaded = Object.values(dependencies["Chart Objects"]).every(Boolean)
    if (!dependencies["Papa Parse"]) alert("Papa Parse library not loaded!")
    if (!dependencies["Chart.js"]) alert("Chart.js library not loaded!")
    if (!allChartObjectsLoaded) console.warn("One or more custom chart objects (chart1.js-chart6.js) not loaded!")
    return dependencies
  }

  function restoreUploadCardUI() {
    const uploadCard = document.querySelector(".upload-card")
    if (uploadCard) {
      uploadCard.innerHTML = `
                <div class="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="uploadIconTitleReloaded">
                        <title id="uploadIconTitleReloaded">Upload File Icon</title>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <h2 id="uploadHeadingReloaded">Upload Your CSV File</h2>
                <p>Drag and drop your CSV file here or click to browse</p>
                <div class="upload-options">
                    <label for="csvFile" class="upload-button">
                        <span>Choose File</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </label>
                    <div class="upload-divider"><span>or</span></div>
                    <button id="loadSampleData" class="upload-button sample-button">
                        <span>Load Sample Data</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2"/>
                            <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" stroke-width="2"/>
                            <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <input type="file" id="csvFile" accept=".csv" class="hidden-input">
                <div class="file-info hidden" id="fileInfo">
                    <div class="file-icon" aria-hidden="true">📄</div>
                    <div class="file-details">
                        <span class="file-name" id="fileName"></span>
                        <span class="file-size" id="fileSize"></span>
                    </div>
                </div>`

      csvFileInput = document.getElementById("csvFile")
      if (csvFileInput) csvFileInput.addEventListener("change", handleFileUpload)

      loadSampleDataBtn = document.getElementById("loadSampleData")
      if (loadSampleDataBtn) loadSampleDataBtn.addEventListener("click", loadSampleData)
    }
  }

  function handleFileUpload(event) {
    console.log("File upload initiated")
    const file = event.target.files[0]
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        alert("Please select a CSV file.")
        return
      }
      parseCSVFile(file)
      if (csvFileInput) csvFileInput.value = ""
    }
  }

  function loadSampleData() {
    console.log("Loading sample data...")
    showLoadingStateInUploadCard("Loading sample data...")

    fetch(SAMPLE_DATA_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return response.text()
      })
      .then((csvText) => {
        if (!window.Papa) {
          alert("Papa Parse library not loaded. Cannot parse sample data.")
          restoreUploadCardUI()
          return
        }
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("Parse errors in sample data:", results.errors)
              alert("Error parsing sample data: " + results.errors.map((e) => e.message).join("\n"))
              restoreUploadCardUI()
              return
            }
            processCSVData(results.data)
            displayFileInfo({ name: "envato-sample.csv", size: csvText.length })
            showSections()
            currentFilteredData = [...rawParsedData]
            currentPage = 1
            updateHeaderStats()
            updateStatistics()
            applyFilters()
            restoreUploadCardUI()
          },
          error: (err) => {
            console.error("Papa Parse error (sample data):", err)
            alert("Error parsing sample data CSV: " + err.message)
            restoreUploadCardUI()
          },
        })
      })
      .catch((error) => {
        console.error("Sample data loading error:", error)
        alert("Error loading sample data: " + error.message)
        restoreUploadCardUI()
      })
  }

  function parseCSVFile(file) {
    console.log("Parsing CSV file:", file.name)
    showLoadingStateInUploadCard(`Parsing ${file.name}...`)

    if (!window.Papa) {
      alert("Papa Parse library not loaded. Cannot parse file.")
      restoreUploadCardUI()
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error("Parse errors:", results.errors)
          alert("Error parsing CSV file: " + results.errors.map((e) => e.message).join("\n"))
          restoreUploadCardUI()
          return
        }
        processCSVData(results.data)
        displayFileInfo(file)
        showSections()
        currentFilteredData = [...rawParsedData]
        currentPage = 1
        updateHeaderStats()
        updateStatistics()
        applyFilters()
        restoreUploadCardUI()
      },
      error: (err) => {
        console.error("Papa Parse error:", err)
        alert("Error reading CSV file: " + err.message)
        restoreUploadCardUI()
      },
    })
  }

  function showLoadingStateInUploadCard(message = "Loading...") {
    const uploadCard = document.querySelector(".upload-card")
    if (uploadCard) {
      uploadCard.innerHTML = `<div class="loading">${message}</div>`
    }
  }

  function extractValue(row, possibleKeys, defaultValue = "") {
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
        return String(row[key]).trim()
      }
    }
    return defaultValue
  }

  function processCSVData(rawData) {
    console.log("Processing CSV data:", rawData.length, "rows")
    if (!rawData || rawData.length === 0) {
      alert("The CSV file appears to be empty or invalid.")
      return
    }

    rawParsedData = rawData
      .map((row, index) => {
        if (typeof row !== "object" || row === null) {
          console.warn(`Invalid row at index ${index}:`, row)
          return null
        }

        const productName = extractValue(row, ["hnXAr6Nr", "product_name", "Product Name", "title", "name"])
        const productUrl = extractValue(row, ["XnPoMwM8 href", "product_url", "Product URL", "url", "link"])
        const authorName = extractValue(row, ["ue7JtEW9", "author", "author_name", "user", "Author Name"])
        const status = extractValue(row, ["hwx8hBPN", "status", "state", "Status"], "Unknown")
        const imageUrl = extractValue(row, ["AFrX7o04 src", "image", "image_url", "thumbnail", "Image URL"])
        const similarUrl = extractValue(row, ["S0vcnurE href", "similar_url", "related_url", "Similar URL"])

        if (!productName && !authorName) return null

        let userId = extractUserFromUrl(productUrl)
        if (!userId) {
          const cleanedAuthorName = (authorName || "").replace(/\s+/g, "")
          userId = cleanedAuthorName || `AuthorID_${Math.floor(Math.random() * 10000)}`
        }

        return {
          ProductName: productName || "Unknown Product",
          ProductURL: productUrl || "",
          AuthorName: authorName || "Unknown Author",
          ImageUrl: imageUrl || "",
          Status: status,
          SimilarURL: similarUrl || "",
          UserId: userId,
          Category: categorizeProduct(productName),
          Theme: detectTheme(productName),
          WordCount: countWords(productName),
          CharacterCount: (productName || "").length,
          FirstLetter: (productName || "").charAt(0).toUpperCase() || "?",
          TitleLength: (productName || "").length,
        }
      })
      .filter((row) => row !== null)

    console.log("Processed data:", rawParsedData.length, "valid rows")
    if (rawParsedData.length === 0 && rawData.length > 0) {
      alert("No valid data could be extracted. Please check column names or file content.")
    }
    populateStatusFilter()
  }

  function extractUserFromUrl(url) {
    if (!url) return null
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname.includes("elements.envato.com") && urlObj.pathname.startsWith("/user/")) {
        return urlObj.pathname.split("/")[2]
      }
      const match = url.match(/\/user\/([^/?]+)/) || url.match(/\/u\/([^/?]+)/) || url.match(/author\/([^/?]+)/)
      if (match && match[1]) return match[1]
    } catch (e) {
      /* Invalid URL, ignore */
    }
    return null
  }

  const categoryPriority = [
    "Mockup", "Flyer & Poster", "Social Media"
  ]

  function categorizeProduct(productName) {
    const nameLower = String(productName || "").toLowerCase()
    if (!nameLower) return "Other"

    // Cek kategori prioritas dulu
    for (const category of categoryPriority) {
      const keywords = categoriesMap[category]
      if (keywords && keywords.some((keyword) => nameLower.includes(keyword.toLowerCase()))) {
        return category
      }
    }
    // Jika tidak ada yang cocok, cek kategori lain
    for (const [category, keywords] of Object.entries(categoriesMap)) {
      if (keywords.some((keyword) => nameLower.includes(keyword.toLowerCase()))) return category
    }
    return "Other"
  }

  function detectTheme(productName) {
    const nameLower = String(productName || "").toLowerCase()
    if (!nameLower) return "Other"
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some((keyword) => nameLower.includes(keyword))) return theme
    }
    return "Other"
  }

  function countWords(text) {
    return String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length
  }

  function populateStatusFilter() {
    if (!statusFilterSelect) return
    statusFilterSelect.innerHTML = '<option value="all">All Status</option>'
    if (rawParsedData.length === 0) return
    const statuses = [...new Set(rawParsedData.map((row) => row.Status).filter(Boolean))]
    statuses.sort().forEach((status) => {
      const option = document.createElement("option")
      option.value = status
      option.textContent = status
      statusFilterSelect.appendChild(option)
    })
    console.log("Status filter populated with:", statuses)
  }

  function displayFileInfo(file) {
    if (fileNameSpan) fileNameSpan.textContent = file.name
    if (fileSizeSpan) fileSizeSpan.textContent = formatFileSize(file.size)
    if (fileInfoDiv) {
      fileInfoDiv.style.display = "flex"
      fileInfoDiv.classList.remove("hidden")
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(k)))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  function showSections() {
    console.log("Attempting to show sections...")
    const sectionsWithHiddenClass = [statisticsSection, previewSection, filtersSection, visualizationsSection]
    sectionsWithHiddenClass.forEach((section) => {
      if (section) {
        section.classList.remove("hidden")
        section.style.display = "block"
        section.classList.remove("fade-in")
        void section.offsetWidth
        section.classList.add("fade-in")
        console.log(section.id + " should now be visible and fading in.")
      } else {
        console.warn(`Section element not found in DOM.`)
      }
    })
    if (headerStatsDiv) {
      headerStatsDiv.style.display = "flex"
      console.log("headerStatsDiv display set to flex.")
    } else {
      console.warn("headerStatsDiv element not found in DOM.")
    }
    console.log("showSections executed.")
  }

  function updateHeaderStats() {
    const totalRec = rawParsedData.length
    const uniqueProd = new Set(rawParsedData.map((row) => row.ProductName).filter(Boolean)).size
    const uniqueCat = new Set(rawParsedData.map((row) => row.Category).filter(Boolean)).size
    if (totalRecordsSpan) totalRecordsSpan.textContent = totalRec.toLocaleString()
    if (totalProductsSpan) totalProductsSpan.textContent = uniqueProd.toLocaleString()
    if (totalCategoriesSpan) totalCategoriesSpan.textContent = uniqueCat.toLocaleString()
    console.log("Header stats updated:", { totalRec, uniqueProd, uniqueCat })
  }

  function updateStatistics() {
    console.log("Updating statistics...")

    // Update Top Authors
    const authorCounts = getCounts(rawParsedData.map((row) => row.AuthorName).filter(Boolean))
    renderStatisticsList("authors-list", authorCounts, "author")

    // Update Top Categories
    const categoryCounts = getCounts(rawParsedData.map((row) => row.Category).filter(Boolean))
    renderStatisticsList("categories-list", categoryCounts, "category")

    // Update Top Themes
    const themeCounts = getCounts(rawParsedData.map((row) => row.Theme).filter(Boolean))
    renderStatisticsList("themes-list", themeCounts, "theme")

    // Update accordion behavior after data is loaded
    setTimeout(() => {
      updateAccordionBehavior()
    }, 200)
  }

  function getCounts(arr) {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1
      return acc
    }, {})
  }

  function renderStatisticsList(elementId, counts, type) {
    const listContainer = document.getElementById(elementId)
    if (!listContainer) {
      console.error(`Element with ID ${elementId} not found.`)
      return
    }

    const sortedData = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      // .slice(0, 20) // Show Top 20 Most Uploaded Product Titles

    if (sortedData.length === 0) {
      listContainer.innerHTML = `<p>No ${type} data available.</p>`
      return
    }

    const textContainer = document.createElement("div")
    textContainer.className = "tag-flow-container"

    sortedData.forEach((item) => {
      const tagElement = document.createElement("span")
      tagElement.className = "tag"
      tagElement.textContent = `${item.name} (${item.count})`

      // Add data attributes for tooltip
      tagElement.dataset.type = type
      tagElement.dataset.name = item.name
      tagElement.dataset.count = item.count

      textContainer.appendChild(tagElement)
    })

    listContainer.innerHTML = ""
    listContainer.appendChild(textContainer)

    // Add tooltip listeners after rendering



    if (window.TooltipManager && window.TooltipManager.addTooltipListeners) {
      setTimeout(() => {
        window.TooltipManager.addTooltipListeners()
      }, 100)
    }
  }

  function applyFilters() {
    console.log("Applying filters...")
    currentPage = 1
    const selectedStatus = statusFilterSelect ? statusFilterSelect.value : "all"
    const productKeyword = productFilterInput ? productFilterInput.value.toLowerCase().trim() : ""
    const categoryKeyword = categoryFilterInput ? categoryFilterInput.value.toLowerCase().trim() : ""

    currentFilteredData = rawParsedData.filter((row) => {
      const matchesStatus = selectedStatus === "all" || row.Status === selectedStatus
      const matchesProduct =
        !productKeyword ||
        String(row.ProductName || "")
          .toLowerCase()
          .includes(productKeyword)
      const matchesCategory =
        !categoryKeyword ||
        String(row.Category || "")
          .toLowerCase()
          .includes(categoryKeyword)
      return matchesStatus && matchesProduct && matchesCategory
    })

    console.log("Filtered data:", currentFilteredData.length, "rows")
    displayDataPreview()
    generateAllVisualizations()
  }

  function resetFilters() {
    if (statusFilterSelect) statusFilterSelect.value = "all"
    if (productFilterInput) productFilterInput.value = ""
    if (categoryFilterInput) categoryFilterInput.value = ""
    applyFilters()
  }

  function displayDataPreview() {
    const tableContainer = document.querySelector(".table-wrapper")
    if (!tableContainer) return

    let dataTable = tableContainer.querySelector(".data-table")
    if (!dataTable) {
      tableContainer.innerHTML = `<table id="csvTable" class="data-table"><caption>Dataset Preview</caption><thead id="tableHeaders"></thead><tbody id="tableBody"></tbody></table>`
      dataTable = tableContainer.querySelector(".data-table")
    }

    const tableHead = dataTable.querySelector("thead") || dataTable.createTHead()
    const tableBody = dataTable.querySelector("tbody") || dataTable.createTBody()
    tableHead.innerHTML = ""

    const headers = ["Product URL", "Product Name", "Author Name", "Category", "Status"]
    const headerRow = tableHead.insertRow()
    headers.forEach((headerText) => {
      const th = document.createElement("th")
      th.textContent = headerText
      headerRow.appendChild(th)
    })

    renderPage(currentPage)
  }

  function renderPage(page) {
    currentPage = page
    const tableBody = document.getElementById("tableBody")
    if (!tableBody) return
    tableBody.innerHTML = ""

    if (currentFilteredData.length === 0) {
      const emptyRow = tableBody.insertRow()
      emptyRow.className = "empty-state"
      const cell = emptyRow.insertCell()
      cell.colSpan = 5
      cell.textContent = "No matching data found. Try adjusting your filters."
      if (paginationControlsDiv) paginationControlsDiv.innerHTML = ""
      return
    }

    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const pageData = currentFilteredData.slice(start, end)

    pageData.forEach((row) => {
      const tr = tableBody.insertRow()
      const tdUrl = tr.insertCell()
      if (row.ProductURL) {
        const aUrl = document.createElement("a")
        aUrl.href = row.ProductURL
        aUrl.target = "_blank"
        aUrl.rel = "noopener noreferrer"
        aUrl.textContent = row.ProductURL.length > 40 ? row.ProductURL.substring(0, 37) + "..." : row.ProductURL
        tdUrl.appendChild(aUrl)
      } else {
        tdUrl.textContent = "-"
      }
      tr.insertCell().textContent = row.ProductName || "-"
      tr.insertCell().textContent = row.AuthorName || "N/A"
      tr.insertCell().textContent = row.Category || "Other"
      const tdStatus = tr.insertCell()
      tdStatus.textContent = row.Status || "Unknown"
      if (row.Status && row.Status !== "Unknown" && tdStatus.classList) tdStatus.classList.add("status-badge")
    })
    renderPaginationControls()
  }

  function renderPaginationControls() {
    if (!paginationControlsDiv) return
    paginationControlsDiv.innerHTML = ""

    const totalPages = Math.ceil(currentFilteredData.length / ITEMS_PER_PAGE)
    if (totalPages <= 1) return

    // Previous button
    const prevButton = document.createElement("button")
    prevButton.textContent = "Previous"
    prevButton.className = "btn btn-secondary"
    prevButton.disabled = currentPage === 1
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) renderPage(currentPage - 1)
    })
    paginationControlsDiv.appendChild(prevButton)

    // Page numbers
    const MAX_PAGE_BUTTONS = 5
    let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2))
    const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1)

    if (endPage - startPage + 1 < MAX_PAGE_BUTTONS && startPage > 1) {
      startPage = Math.max(1, endPage - MAX_PAGE_BUTTONS + 1)
    }

    if (startPage > 1) {
      const firstButton = document.createElement("button")
      firstButton.textContent = "1"
      firstButton.className = "btn page-number"
      firstButton.addEventListener("click", () => renderPage(1))
      paginationControlsDiv.appendChild(firstButton)
      if (startPage > 2) {
        const ellipsis = document.createElement("span")
        ellipsis.textContent = "..."
        ellipsis.style.margin = "0 5px"
        paginationControlsDiv.appendChild(ellipsis)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement("button")
      pageButton.textContent = i
      pageButton.className = "btn page-number"
      if (i === currentPage) {
        pageButton.disabled = true
        pageButton.style.fontWeight = "bold"
      }
      pageButton.addEventListener("click", () => renderPage(i))
      paginationControlsDiv.appendChild(pageButton)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement("span")
        ellipsis.textContent = "..."
        ellipsis.style.margin = "0 5px"
        paginationControlsDiv.appendChild(ellipsis)
      }
      const lastButton = document.createElement("button")
      lastButton.textContent = totalPages
      lastButton.className = "btn page-number"
      lastButton.addEventListener("click", () => renderPage(totalPages))
      paginationControlsDiv.appendChild(lastButton)
    }

    // Next button
    const nextButton = document.createElement("button")
    nextButton.textContent = "Next"
    nextButton.className = "btn btn-secondary"
    nextButton.disabled = currentPage === totalPages
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) renderPage(currentPage + 1)
    })
    paginationControlsDiv.appendChild(nextButton)

    // Page info
    const pageInfo = document.createElement("div")
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (Total ${currentFilteredData.length} records)`
    pageInfo.style.marginTop = "10px"
    pageInfo.style.fontSize = "0.9em"
    paginationControlsDiv.appendChild(pageInfo)
  }

  function generateAllVisualizations() {
    console.log("Generating all visualizations...")
    checkDependencies()
    destroyAllCharts()
    if (currentFilteredData.length === 0) {
      showNoDataMessageInCharts()
      return
    }
    setTimeout(() => generateTopUsersChart(), 100)
    setTimeout(() => generateTopProductTitlesChart(), 200)
    setTimeout(() => generateUserPercentageChart(), 300)
    setTimeout(() => generateUniqueProductsChart(), 400)
    setTimeout(() => generateStatusChart(), 500)
    setTimeout(() => generateCategoriesChart(), 600)
  }

  function destroyAllCharts() {
    Object.values(chartInstances).forEach((chart) => {
      if (chart && typeof chart.destroy === "function") chart.destroy()
    })
    Object.keys(chartInstances).forEach((key) => {
      chartInstances[key] = null
    })
  }

  function showNoDataMessageInCharts() {
    const chartContainers = document.querySelectorAll(".chart-container")
    chartContainers.forEach((container) => {
      container.innerHTML = `<div class="no-data-message"><svg viewBox="0 0 24 24"><path d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zm-2.122 2.121a6 6 0 10-8.484 0 6 6 0 008.484 0zM12 10.586l-2.121-2.122L8.758 9.586 10.879 11.707 8.758 13.828l1.121 1.121L12 12.828l2.121 2.121 1.121-1.121L13.121 11.707l2.121-2.121-1.121-1.121L12 10.586z" fill="currentColor"/></svg><p>No data for charts.</p></div>`
    })
  }

  function generateTopUsersChart() {
    if (!window.TopUsersChart) {
      console.error("TopUsersChart (chart1.js) not available")
      return
    }
    const userCounts = getCounts(currentFilteredData.map((row) => row.UserId || row.AuthorName).filter(Boolean))
    const topUsers = getTopN(userCounts, 20)
    if (topUsers.length === 0) {
      console.warn("No user data for TopUsersChart")
      return
    }
    const chartData = {
      labels: topUsers.map((item) => truncateText(item[0], 20)),
      datasets: [
        {
          label: "Products",
          data: topUsers.map((item) => item[1]),
          backgroundColor: RAINBOW_PALETTE.slice(0, topUsers.length),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }
    try {
      chartInstances.topUsers = window.TopUsersChart.create("topUsersChart", chartData)
    } catch (e) {
      console.error("Error creating TopUsersChart instance:", e)
    }
  }

  function generateTopProductTitlesChart() {
    if (!window.TopProductTitlesChart) {
      console.error("TopProductTitlesChart (chart2.js) not available")
      return
    }
    const titleCounts = getCounts(currentFilteredData.map((row) => row.ProductName).filter(Boolean))
    const topTitles = getTopN(titleCounts, 20)
    if (topTitles.length === 0) {
      console.warn("No product title data for chart")
      return
    }
    const chartData = {
      labels: topTitles.map((item) => truncateText(item[0], 30)),
      datasets: [
        {
          label: "Uploads",
          data: topTitles.map((item) => item[1]),
          backgroundColor: RAINBOW_PALETTE.slice(0, topTitles.length),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    }
    try {
      chartInstances.topProductTitles = window.TopProductTitlesChart.create("topProductTitlesChart", chartData)
    } catch (e) {
      console.error("Error creating TopProductTitlesChart instance:", e)
    }
  }

  function generateUserPercentageChart() {
    if (!window.UserPercentageChart) {
      console.error("UserPercentageChart (chart3.js) not available")
      return
    }
    const userCounts = getCounts(currentFilteredData.map((row) => row.UserId || row.AuthorName).filter(Boolean))
    const topUsers = getTopN(userCounts, 10)
    if (topUsers.length === 0) {
      console.warn("No user data for percentage chart")
      return
    }
    const chartData = {
      labels: topUsers.map((item) => truncateText(item[0], 15)),
      datasets: [
        {
          data: topUsers.map((item) => item[1]),
          backgroundColor: RAINBOW_PALETTE.slice(0, topUsers.length),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    }
    try {
      chartInstances.userPercentage = window.UserPercentageChart.create("userPercentageChart", chartData)
    } catch (e) {
      console.error("Error creating UserPercentageChart instance:", e)
    }
  }

  function generateUniqueProductsChart() {
    const ctx = document.getElementById('uniqueProductsChart').getContext('2d')
    // 1. Dapatkan mapping produk unik per author
    const uniqueProductsMap = getUniqueProductsByAuthor(rawParsedData)
    // 2. Siapkan data chart
    const authorNames = Object.keys(uniqueProductsMap)
    const uniqueCounts = authorNames.map(name => uniqueProductsMap[name].length)
    // 3. Ambil top 20
    const sorted = authorNames
      .map((name, i) => ({ name, count: uniqueCounts[i] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
    const labels = sorted.map(x => x.name)
    const data = sorted.map(x => x.count)

    // 4. Simpan mapping untuk tooltip
    window.UniqueProductsByAuthor = uniqueProductsMap

    // 5. Buat chart
    if (window.UniqueProductsChart) window.UniqueProductsChart.destroy()
    window.UniqueProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Unique Product',
          data,
          backgroundColor: '#2563eb'
        }]
      },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: getChartTextColor()
              }
            },
            tooltip: {
              bodyColor: getChartTextColor(),
              titleColor: getChartTextColor(),
              backgroundColor: document.body.classList.contains('dark-mode') ? '#1f2937' : '#fff',
              callbacks: {
                label: function(context) {
                  const author = context.label
                  const products = window.UniqueProductsByAuthor[author] || []
                  const lines = [`Unique Product: ${products.length}`]
                  if (products.length > 0) {
                    // Tampilkan max 10 produk, satu per baris
                    lines.push(...products.slice(0, 20))
                    if (products.length > 20) lines.push(`...and ${products.length - 20} more`)
                  }
                  return lines
                }
              }
            }
          },
          layout: {
            padding: { left: 10, right: 10, top: 10, bottom: 30 }
          },
          scales: {
            x: {
              ticks: {
                color: getChartTextColor(),
                font: { size: 13 },
                autoSkip: false, // tampilkan semua label
                maxRotation: 45, // miringkan label agar muat
                minRotation: 30,
                callback: function(value, index, ticks) {
                  // Potong label jika terlalu panjang
                  const label = this.getLabelForValue(value)
                  return label.length > 18 ? label.slice(0, 18) + '…' : label
                }
              }
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Unique Product Count' }
            }
          }
        }
      })
  }

  function generateStatusChart() {
    if (!window.StatusChart) {
      console.error("StatusChart (chart5.js) not available")
      return
    }
    const statusCounts = getCounts(currentFilteredData.map((row) => row.Status).filter(Boolean))
    const sortedStatuses = Object.entries(statusCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // tampilkan 10 status teratas
    const labels = sortedStatuses.map(([status]) => status)
    const data = sortedStatuses.map(([, count]) => count)

    const chartData = {
      labels,
      datasets: [{
        label: "Products",
        data,
        backgroundColor: RAINBOW_PALETTE.slice(0, labels.length),
        borderWidth: 1,
        borderRadius: 4,
      }]
    }

    try {
      chartInstances.status = window.StatusChart.create("statusChart", chartData)
    } catch (e) {
      console.error("Error creating StatusChart instance:", e)
    }
  }

  function generateCategoriesChart() {
    if (!window.CategoriesChart) {
      console.error("CategoriesChart (chart6.js) not available")
      return
    }
    // Ambil data kategori dari currentFilteredData
    const categoryCounts = getCounts(currentFilteredData.map(row => row.Category || "Other").filter(Boolean))
    const sortedCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20) // tampilkan 20 kategori teratas, atau hapus .slice untuk semua
    const labels = sortedCategories.map(([cat]) => cat)
    const data = sortedCategories.map(([, count]) => count)

    const chartData = {
      labels,
      datasets: [{
        label: "Products",
        data,
        backgroundColor: RAINBOW_PALETTE.slice(0, labels.length),
        borderWidth: 1,
        borderRadius: 4,
      }]
    }

    try {
      if (chartInstances.categories && typeof chartInstances.categories.destroy === "function") {
        chartInstances.categories.destroy()
      }
      chartInstances.categories = window.CategoriesChart.create("categoriesChart", chartData)
    } catch (e) {
      console.error("Error creating CategoriesChart instance:", e)
    }
  }

  function getTopN(counts, n) {
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
  }

  function truncateText(text, maxLength) {
    if (typeof text !== "string") text = String(text)
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text
  }

  function getUniqueProductsByAuthor(data) {
    const map = {}
    data.forEach(row => {
      if (!row.AuthorName || !row.ProductName) return
      if (!map[row.AuthorName]) map[row.AuthorName] = new Set()
      map[row.AuthorName].add(row.ProductName)
    })
    // Convert Set to Array
    Object.keys(map).forEach(author => {
      map[author] = Array.from(map[author])
    })
    return map
  }

  function getChartTextColor() {
    return document.body.classList.contains('dark-mode')
      ? '#f3f4f6' // var(--dark-text-color)
      : '#222'    // var(--text-color)
  }

  window.ChartManager = {
    regenerateAllCharts: () => {
      generateAllVisualizations()
    },
    getFilteredData: () => currentFilteredData,
    getRawData: () => rawParsedData,
  }

  setTimeout(checkDependencies, 1000)
  console.log("Enhanced Application initialized successfully")
})
