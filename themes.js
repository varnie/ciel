// Each row is French | English. IDs and ordering are stable for saved progress and audio.
const data = [
['greetings','👋','Знакомство',`bonjour|hello
bonsoir|good evening
au revoir|goodbye
merci|thank you
à bientôt|see you soon
à demain|see you tomorrow
bienvenue|welcome
s’il vous plaît|please
enchanté|nice to meet you
bonne nuit|good night`],
['family','👨‍👩‍👧','Семья',`la mère|the mother
le père|the father
la sœur|the sister
le frère|the brother
la fille|the daughter
le fils|the son
la grand-mère|the grandmother
le grand-père|the grandfather
la tante|the aunt
l’oncle|the uncle`],
['body','🖐','Тело',`la tête|the head
le bras|the arm
la main|the hand
la jambe|the leg
le pied|the foot
le dos|the back
le ventre|the belly
le cou|the neck
le genou|the knee
l’épaule|the shoulder`],
['face','😊','Лицо',`le visage|the face
les yeux|the eyes
le nez|the nose
la bouche|the mouth
les oreilles|the ears
les cheveux|the hair
les dents|the teeth
la langue|the tongue
le front|the forehead
le menton|the chin`],
['clothes','👕','Одежда',`une chemise|a shirt
un pantalon|a pair of trousers
une robe|a dress
une jupe|a skirt
un manteau|a coat
un pull|a sweater
une veste|a jacket
un chapeau|a hat
une écharpe|a scarf
des chaussettes|socks`],
['colors','🎨','Цвета',`rouge|red
bleu|blue
vert|green
jaune|yellow
noir|black
blanc|white
rose|pink
violet|purple
gris|gray
marron|brown`],
['numbers','🔢','Числа',`un|one
deux|two
trois|three
quatre|four
cinq|five
six|six
sept|seven
huit|eight
neuf|nine
dix|ten`],
['time','🕐','Время',`aujourd’hui|today
demain|tomorrow
hier|yesterday
maintenant|now
bientôt|soon
tard|late
tôt|early
toujours|always
jamais|never
parfois|sometimes`],
['calendar','📅','Календарь',`lundi|Monday
mardi|Tuesday
mercredi|Wednesday
jeudi|Thursday
vendredi|Friday
samedi|Saturday
dimanche|Sunday
la semaine|the week
le mois|the month
l’année|the year`],
['weather','🌦','Погода',`le brouillard|the fog
un orage|a thunderstorm
un éclair|a flash of lightning
le tonnerre|the thunder
la grêle|the hail
le gel|the frost
un arc-en-ciel|a rainbow
la chaleur|the heat
le froid|the cold
une averse|a shower of rain`],
['seasons','🍂','Сезоны',`le printemps|spring
l’été|summer
l’automne|autumn
l’hiver|winter
janvier|January
février|February
avril|April
juillet|July
octobre|October
décembre|December`],
['fruit','🍒','Фрукты',`une poire|a pear
une banane|a banana
une pêche|a peach
un abricot|an apricot
une prune|a plum
une cerise|a cherry
un citron|a lemon
un ananas|a pineapple
une pastèque|a watermelon
une framboise|a raspberry`],
['vegetables','🥕','Овощи',`une carotte|a carrot
une tomate|a tomato
une pomme de terre|a potato
un oignon|an onion
un concombre|a cucumber
une courgette|a zucchini
une aubergine|an eggplant
un poivron|a bell pepper
un chou|a cabbage
un radis|a radish`],
['drinks','🥤','Напитки',`l’eau|water
le jus de pomme|apple juice
le jus d’orange|orange juice
le chocolat chaud|hot chocolate
la limonade|lemonade
l’eau gazeuse|sparkling water
le thé vert|green tea
le café au lait|coffee with milk
une tisane|an herbal tea
un smoothie|a smoothie`],
['desserts','🍰','Десерты',`un gâteau|a cake
une tarte|a tart
une glace|an ice cream
un biscuit|a cookie
un bonbon|a candy
le miel|honey
la confiture|jam
une crêpe|a thin pancake
une gaufre|a waffle
la vanille|vanilla`],
['cooking','🍳','Готовка',`couper|to cut
mélanger|to mix
cuire|to cook
bouillir|to boil
frire|to fry
éplucher|to peel
verser|to pour
goûter|to taste
peser|to weigh
remuer|to stir`],
['kitchen','🥣','Кухня',`une casserole|a saucepan
une poêle|a frying pan
un four|an oven
un réfrigérateur|a refrigerator
un évier|a kitchen sink
un bol|a bowl
un verre|a drinking glass
une bouilloire|a kettle
un grille-pain|a toaster
une passoire|a colander`],
['home','🏠','Дом',`la cuisine|the kitchen
la chambre|the bedroom
le salon|the living room
la salle de bains|the bathroom
le couloir|the hallway
le toit|the roof
le mur|the wall
le plafond|the ceiling
l’escalier|the staircase
le balcon|the balcony`],
['furniture','🛋','Мебель',`une table|a table
une chaise|a chair
un lit|a bed
un canapé|a sofa
un fauteuil|an armchair
une armoire|a wardrobe
une étagère|a shelf
une commode|a chest of drawers
un bureau|a desk
un tabouret|a stool`],
['bathroom','🛁','Ванная',`le savon|soap
le shampoing|shampoo
une brosse à dents|a toothbrush
le dentifrice|toothpaste
une douche|a shower
une baignoire|a bathtub
un miroir|a mirror
un peigne|a comb
un rasoir|a razor
une éponge|a sponge`],
['pets','🐾','Питомцы',`un chiot|a puppy
un chaton|a kitten
un lapin|a rabbit
un hamster|a hamster
un perroquet|a parrot
un poisson rouge|a goldfish
une tortue|a turtle
un cochon d’Inde|a guinea pig
une laisse|a leash
une cage|a cage`],
['wildlife','🦊','Дикие животные',`un lion|a lion
un tigre|a tiger
un éléphant|an elephant
une girafe|a giraffe
un singe|a monkey
un ours|a bear
un loup|a wolf
un renard|a fox
un cerf|a deer
un zèbre|a zebra`],
['farm','🐄','Ферма',`une vache|a cow
un cheval|a horse
un mouton|a sheep
une chèvre|a goat
un cochon|a pig
une poule|a hen
un coq|a rooster
un canard|a duck
une oie|a goose
un âne|a donkey`],
['ocean','🐬','Океан',`une baleine|a whale
un dauphin|a dolphin
un requin|a shark
une pieuvre|an octopus
une méduse|a jellyfish
un crabe|a crab
une crevette|a shrimp
un phoque|a seal
une étoile de mer|a starfish
un hippocampe|a seahorse`],
['insects','🦋','Маленькие существа',`une abeille|a bee
un papillon|a butterfly
une fourmi|an ant
une mouche|a fly
un moustique|a mosquito
une coccinelle|a ladybug
une libellule|a dragonfly
une sauterelle|a grasshopper
une araignée|a spider
un escargot|a snail`],
['landscapes','🏞','Природа',`une rivière|a river
un lac|a lake
une île|an island
une colline|a hill
une vallée|a valley
un désert|a desert
une cascade|a waterfall
une grotte|a cave
un rocher|a rock
une plage|a beach`],
['plants','🌱','Растения',`une feuille|a leaf
une branche|a branch
une racine|a root
une graine|a seed
une rose|a rose
une tulipe|a tulip
un tournesol|a sunflower
un chêne|an oak
un sapin|a fir tree
la mousse|moss`],
['transport','🚲','Транспорт',`un avion|an airplane
un bateau|a boat
un camion|a truck
une moto|a motorcycle
un tramway|a tram
le métro|the subway
un taxi|a taxi
un hélicoptère|a helicopter
une ambulance|an ambulance
une trottinette|a kick scooter`],
['travel','🧳','Путешествия',`un passeport|a passport
une valise|a suitcase
un sac à dos|a backpack
un visa|a visa
un voyage|a trip
une frontière|a border
un touriste|a tourist
une réservation|a reservation
un départ|a departure
une arrivée|an arrival`],
['hotel','🛎','Отель',`la réception|the reception desk
un ascenseur|an elevator
une chambre double|a double room
une chambre simple|a single room
le petit-déjeuner|breakfast
un oreiller|a pillow
une couverture|a blanket
un drap|a bedsheet
la climatisation|air conditioning
une nuitée|an overnight stay`],
['directions','🧭','Направления',`à gauche|to the left
à droite|to the right
tout droit|straight ahead
devant|in front of
derrière|behind
près de|near
loin de|far from
entre|between
en haut|upstairs
en bas|downstairs`],
['shopping','🛍','Покупки',`le prix|the price
une réduction|a discount
un reçu|a receipt
la caisse|the checkout
un panier|a basket
un chariot|a shopping cart
un client|a customer
une vendeuse|a saleswoman
la taille|the clothing size
une cabine d’essayage|a fitting room`],
['money','💶','Деньги',`l’argent|money
une pièce|a coin
un billet de banque|a banknote
une carte bancaire|a bank card
un portefeuille|a wallet
un budget|a budget
une facture|an invoice
un salaire|a salary
une dette|a debt
les économies|savings`],
['school','🎒','Учёба',`un stylo|a pen
un crayon|a pencil
une gomme|an eraser
un cahier|a notebook
une règle|a ruler
un tableau|a blackboard
une leçon|a lesson
un examen|an exam
les devoirs|homework
une question|a question`],
['work','💼','Работа',`un emploi|a job
une entreprise|a company
un collègue|a colleague
une réunion|a meeting
un contrat|a contract
un entretien|a job interview
un projet|a project
une tâche|a task
une pause|a break
une équipe|a team`],
['professions','🧑‍🍳','Профессии',`un médecin|a doctor
un professeur|a teacher
un ingénieur|an engineer
un cuisinier|a cook
un boulanger|a baker
un serveur|a waiter
un pompier|a firefighter
un policier|a police officer
un artiste|an artist
un journaliste|a journalist`],
['technology','💻','Технологии',`un ordinateur|a computer
un écran|a screen
un clavier|a keyboard
une souris|a computer mouse
un téléphone|a telephone
un chargeur|a charger
une imprimante|a printer
un fichier|a file
un mot de passe|a password
un logiciel|software`],
['music','🎵','Музыка',`une chanson|a song
une guitare|a guitar
un piano|a piano
un violon|a violin
une flûte|a flute
une batterie|a drum kit
un concert|a concert
un chanteur|a singer
une mélodie|a melody
le rythme|the rhythm`],
['art','🖌','Творчество',`un dessin|a drawing
une peinture|a painting
un pinceau|a paintbrush
une sculpture|a sculpture
une photographie|a photograph
une exposition|an exhibition
une galerie|an art gallery
une toile|a canvas
un portrait|a portrait
un croquis|a sketch`],
['sports','⚽','Спорт',`le football|soccer
le tennis|tennis
la natation|swimming
le cyclisme|cycling
la course à pied|running
le ski|skiing
la boxe|boxing
l’escalade|climbing
le patinage|skating
la gymnastique|gymnastics`],
['hobbies','🧩','Увлечения',`la lecture|reading
la danse|dancing
le jardinage|gardening
la couture|sewing
le tricot|knitting
la randonnée|hiking
la pêche|fishing
les échecs|chess
la poterie|pottery
le bricolage|DIY`],
['emotions','💛','Эмоции',`la joie|joy
la tristesse|sadness
la peur|fear
la colère|anger
la surprise|surprise
l’amour|love
la honte|shame
la fierté|pride
l’espoir|hope
la confiance|trust`],
['qualities','✨','Качества',`grand|big
petit|small
long|long
court|short
rapide|fast
lent|slow
facile|easy
difficile|difficult
propre|clean
sale|dirty`],
['actions','🏃','Действия',`marcher|to walk
courir|to run
sauter|to jump
nager|to swim
dormir|to sleep
manger|to eat
boire|to drink
lire|to read
écrire|to write
écouter|to listen`],
['communication','💬','Общение',`parler|to speak
demander|to ask
répondre|to answer
expliquer|to explain
comprendre|to understand
répéter|to repeat
traduire|to translate
raconter|to tell a story
discuter|to discuss
remercier|to thank`],
['space','🚀','Космос',`une planète|a planet
une comète|a comet
un astéroïde|an asteroid
une galaxie|a galaxy
une fusée|a rocket
un satellite|a satellite
un astronaute|an astronaut
un télescope|a telescope
l’univers|the universe
la gravité|gravity`],
['holidays','🎉','Праздники',`un anniversaire|a birthday
un cadeau|a gift
une fête|a party
une bougie|a candle
une invitation|an invitation
un feu d’artifice|fireworks
Noël|Christmas
le Nouvel An|New Year
un déguisement|a costume
un bouquet|a bouquet`]
];
export const extraVocabulary = Object.fromEntries(data.map(([id,icon,title,words]) => [id,words.split('\n').map(row=>row.split('|'))]));
export const themeCatalog = [
  {id:'basics',icon:'☀',title:'Основы'}, {id:'food',icon:'☕',title:'В кафе'}, {id:'city',icon:'🏙',title:'Город'},
  ...data.map(([id,icon,title])=>({id,icon,title}))
];
