import { TargetLanguage } from './types';

export const GUMROAD_PRODUCT_PERMALINK = 'ihrnvp';

export const LANGUAGE_OPTIONS = [
  { value: TargetLanguage.ChineseTW, label: '繁體中文 (Traditional Chinese)', currency: 'TWD' },
  { value: TargetLanguage.English, label: 'English', currency: 'USD' },
  { value: TargetLanguage.Korean, label: '한국어 (Korean)', currency: 'KRW' },
  { value: TargetLanguage.French, label: 'Français (French)', currency: 'EUR' },
  { value: TargetLanguage.Spanish, label: 'Español (Spanish)', currency: 'EUR' },
  { value: TargetLanguage.Thai, label: 'ไทย (Thai)', currency: 'THB' },
  { value: TargetLanguage.Filipino, label: 'Tagalog (Filipino)', currency: 'PHP' },
  { value: TargetLanguage.Vietnamese, label: 'Tiếng Việt (Vietnamese)', currency: 'VND' },
  { value: TargetLanguage.Japanese, label: '日本語 (Japanese)', currency: 'JPY' },
];

export const getTargetCurrency = (lang: TargetLanguage): string => {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === lang);
  return option ? option.currency : 'USD';
};

export const ALLERGENS_MAP: Record<TargetLanguage, Record<string, string>> = {
  [TargetLanguage.ChineseTW]: {
    "Beef": "牛肉", "Pork": "豬肉", "Peanuts": "花生", "Shrimp": "蝦類", "Seafood": "海鮮",
    "Coriander": "香菜", "Nuts": "堅果", "Soy": "大豆", "Eggs": "蛋類", "Milk": "乳製品"
  },
  [TargetLanguage.English]: {
    "Beef": "Beef", "Pork": "Pork", "Peanuts": "Peanuts", "Shrimp": "Shrimp", "Seafood": "Seafood",
    "Coriander": "Coriander", "Nuts": "Nuts", "Soy": "Soy", "Eggs": "Eggs", "Milk": "Milk"
  },
  [TargetLanguage.Japanese]: {
    "Beef": "牛肉", "Pork": "豚肉", "Peanuts": "落花生", "Shrimp": "海老", "Seafood": "シーフード",
    "Coriander": "パクチー", "Nuts": "ナッツ", "Soy": "大豆", "Eggs": "卵", "Milk": "乳製品"
  },
  [TargetLanguage.Korean]: {
    "Beef": "소고기", "Pork": "돼지고기", "Peanuts": "땅콩", "Shrimp": "새우", "Seafood": "해산물",
    "Coriander": "고수", "Nuts": "견과류", "Soy": "콩", "Eggs": "계란", "Milk": "우유"
  },
  [TargetLanguage.French]: {
    "Beef": "Bœuf", "Pork": "Porc", "Peanuts": "Cacahuètes", "Shrimp": "Crevettes", "Seafood": "Fruits de mer",
    "Coriander": "Coriandre", "Nuts": "Noix", "Soy": "Soja", "Eggs": "Œufs", "Milk": "Lait"
  },
  [TargetLanguage.Spanish]: {
    "Beef": "Vaca", "Pork": "Cerdo", "Peanuts": "Cacahuetes", "Shrimp": "Camarones", "Seafood": "Mariscos",
    "Coriander": "Cilantro", "Nuts": "Nueces", "Soy": "Soja", "Eggs": "Huevos", "Milk": "Leche"
  },
  [TargetLanguage.Thai]: {
    "Beef": "เนื้อวัว", "Pork": "เนื้อหมู", "Peanuts": "ถั่วลิสง", "Shrimp": "กุ้ง", "Seafood": "อาหารทะเล",
    "Coriander": "ผักชี", "Nuts": "ถั่ว", "Soy": "ถั่วเหลือง", "Eggs": "ไข่", "Milk": "นม"
  },
  [TargetLanguage.Filipino]: {
    "Beef": "Baka", "Pork": "Baboy", "Peanuts": "Mani", "Shrimp": "Hipon", "Seafood": "Pagkaing-dagat",
    "Coriander": "Wansoy", "Nuts": "Nuts", "Soy": "Soya", "Eggs": "Itlog", "Milk": "Gatas"
  },
  [TargetLanguage.Vietnamese]: {
    "Beef": "Thịt bò", "Pork": "Thịt lợn", "Peanuts": "Lạc", "Shrimp": "Tôm", "Seafood": "Hải sản",
    "Coriander": "Rau mùi", "Nuts": "Hạt", "Soy": "Đậu nành", "Eggs": "Trứng", "Milk": "Sữa"
  }
};

export const ALLERGENS_LIST = Object.keys(ALLERGENS_MAP[TargetLanguage.English]);

// Feature 10: Dining Etiquette Tips (Replaced from translations)
export interface EtiquetteTip {
  countryCodes: string[];
  countryName: string;
  content: Partial<Record<TargetLanguage, string>>;
}

export const ETIQUETTE_TIPS: EtiquetteTip[] = [
  {
    countryCodes: ['GB', 'UK'],
    countryName: "UK",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在英國喝茶時，湯匙不可以留在杯子裡。",
      [TargetLanguage.English]: "Did you know? In the UK, you shouldn't leave your spoon in the cup while drinking tea.",
      [TargetLanguage.Japanese]: "知っていますか？イギリスで紅茶を飲む際、スプーンをカップの中に入れたままにしてはいけません。",
      [TargetLanguage.Korean]: "알고 계셨나요? 영국에서 차를 마실 때 티스푼을 컵 안에 그대로 두면 안 됩니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Anh, không nên để thìa trong tách khi đang uống trà.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในอังกฤษเวลาดื่มชา ไม่ควรแช่ช้อนทิ้งไว้ในถ้วย",
      [TargetLanguage.French]: "Le saviez-vous ? En Angleterre, il ne faut pas laisser la cuillère dans la tasse en buvant du thé.",
      [TargetLanguage.Spanish]: "¿Sabías que? En el Reino Unido, no debes dejar la cuchara dentro de la taza mientras bebes té."
    }
  },
  {
    countryCodes: ['TR'],
    countryName: "Turkey",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在土耳其用餐完畢後，如果不想續杯茶請將茶匙橫放。",
      [TargetLanguage.English]: "Did you know? In Turkey, place your teaspoon across the tea glass if you don't want a refill.",
      [TargetLanguage.Japanese]: "知っていますか？トルコでおかわりが不要な場合は、ティースプーンをグラスの上に横に置きます。",
      [TargetLanguage.Korean]: "알고 계셨나요? 터키에서 차를 더 마시고 싶지 않다면 티스푼을 컵 위에 가로로 올려두세요.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Thổ Nhĩ Kỳ, hãy đặt thìa nằm ngang trên miệng ly nếu bạn không muốn rót thêm trà.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในตุรกีเมื่อดื่มชาเสร็จแล้ว หากไม่ต้องการเติมเพิ่มให้วางช้อนชาพาดไว้บนขอบแก้ว",
      [TargetLanguage.French]: "Le saviez-vous ? En Turquie, posez votre cuillère sur le verre si vous ne voulez plus de thé.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Turquía, coloca la cucharilla sobre el vaso si no quieres que te sirvan más té."
    }
  },
  {
    countryCodes: ['MX'],
    countryName: "Mexico",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在墨西哥吃塔可，當地人通常會直接用手抓著吃。",
      [TargetLanguage.English]: "Did you know? In Mexico, people usually eat tacos with their hands, not cutlery.",
      [TargetLanguage.Japanese]: "知っていますか？メキシコでタコスを食べる際、現地の人は通常手で直接持って食べます。",
      [TargetLanguage.Korean]: "알고 계셨나요? 멕시코에서 타코를 먹을 때 현지인들은 보통 손으로 직접 들고 먹습니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Mexico, người dân địa phương thường dùng tay trực tiếp để ăn taco.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในเม็กซิโก การกินทาโก้มักจะใช้มือหยิบกินโดยตรง",
      [TargetLanguage.French]: "Le saviez-vous ? Au Mexique, on mange généralement les tacos avec les mains.",
      [TargetLanguage.Spanish]: "¿Sabías que? En México, la gente suele comer los tacos directamente con las manos."
    }
  },
  {
    countryCodes: ['IT'],
    countryName: "Italy",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在義大利吃海鮮義大利麵，通常是不加起司粉的。",
      [TargetLanguage.English]: "Did you know? In Italy, it's uncommon to add cheese to seafood pasta.",
      [TargetLanguage.Japanese]: "知っていますか？イタリアでは海鮮パスタに粉チーズをかけないのが一般的です。",
      [TargetLanguage.Korean]: "알고 계셨나요? 이탈리아에서 해산물 파스타를 먹을 때는 보통 치즈 가루를 뿌리지 않습니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Ý, người ta thường không cho thêm phô mai vào mì Ý hải sản.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในอิตาลี การกินพาสต้าอาหารทะเลมักจะไม่โรยชีส",
      [TargetLanguage.French]: "Le saviez-vous ? En Italie, on n'ajoute généralement pas de fromage sur les pâtes aux fruits de mer.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Italia, no se suele añadir queso a la pasta de mariscos."
    }
  },
  {
    countryCodes: ['DE'],
    countryName: "Germany",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在德國與人碰杯時，視線必須看著對方的眼睛。",
      [TargetLanguage.English]: "Did you know? In Germany, you must maintain eye contact when clinking glasses.",
      [TargetLanguage.Japanese]: "知っていますか？ドイツで乾杯する際、相手の目を見てグラスを合わせるのがマナーです。",
      [TargetLanguage.Korean]: "알고 계셨나요? 독일에서 건배할 때는 반드시 상대방의 눈을 쳐다봐야 합니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Đức, khi chạm ly, bạn phải nhìn thẳng vào mắt đối phương.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในเยอรมนีเวลาชนแก้ว คุณต้องสบตาอีกฝ่ายด้วย",
      [TargetLanguage.French]: "Le saviez-vous ? En Allemagne, il faut regarder l'autre dans les yeux au moment de trinquer.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Alemania, debes mirar a los ojos de la otra persona al brindar."
    }
  },
  {
    countryCodes: ['RU'],
    countryName: "Russia",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在俄羅斯收下酒後如果不喝掉，會被視為不禮貌。",
      [TargetLanguage.English]: "Did you know? In Russia, refusing to finish a drink offered to you is considered impolite.",
      [TargetLanguage.Japanese]: "知っていますか？ロシアでお酒を勧められた際、飲み干さないのは失礼にあたります。",
      [TargetLanguage.Korean]: "알고 계셨나요? 러시아에서 술을 받은 후 다 마시지 않으면 무례한 행동으로 간주됩니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Nga, nếu đã nhận rượu mà không uống hết sẽ bị coi là bất lịch sự.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในรัสเซียเมื่อได้รับเหล้าแล้วหากไม่ดื่มให้หมด จะถือว่าเสียมารยาท",
      [TargetLanguage.French]: "Le saviez-vous ? En Russie, il est impoli de ne pas finir un verre d'alcool que l'on vous a offert.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Rusia, se considera de mala educación no terminarse una bebida ofrecida."
    }
  },
  {
    countryCodes: ['ES'],
    countryName: "Spain",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在西班牙用餐，通常要到下午兩點後才開始吃午餐。",
      [TargetLanguage.English]: "Did you know? In Spain, lunch usually doesn't start until after 2 PM.",
      [TargetLanguage.Japanese]: "知っていますか？スペインでの昼食は、通常午後2時以降に始まります。",
      [TargetLanguage.Korean]: "알고 계셨나요? 스페인에서는 보통 오후 2시가 넘어야 점심 식사를 시작합니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Tây Ban Nha, bữa trưa thường chỉ bắt đầu sau 2 giờ chiều.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในสเปน มื้อกลางวันมักจะเริ่มกินกันหลังบ่ายสองโมงเป็นต้นไป",
      [TargetLanguage.French]: "Le saviez-vous ? En Espagne, le déjeuner ne commence généralement qu'après 14 heures.",
      [TargetLanguage.Spanish]: "¿Sabías que? En España, el almuerzo no suele empezar hasta después de las dos de la tarde."
    }
  },
  {
    countryCodes: ['EG'],
    countryName: "Egypt",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在埃及鹽罐通常不在桌上，要求加鹽代表廚師手藝不佳。",
      [TargetLanguage.English]: "Did you know? In Egypt, asking for salt means you find the chef's cooking inadequate.",
      [TargetLanguage.Japanese]: "知っていますか？エジプトで塩を求めるのは、料理が不十分だという意味になり失礼です。",
      [TargetLanguage.Korean]: "알고 계셨나요? 이집트에서 소금을 달라고 하는 것은 요리사의 솜씨가 부족하다는 뜻입니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Ai Cập, yêu cầu thêm muối đồng nghĩa với việc chê đầu bếp nấu ăn không ngon.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในอียิปต์ การขอเกลือเพิ่มหมายถึงคุณคิดว่าพ่อครัวปรุงอาหารได้ไม่อร่อย",
      [TargetLanguage.French]: "Le saviez-vous ? En Égypte, demander du sel signifie que vous trouvez la cuisine du chef médiocre.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Egipto, pedir sal significa que consideras que la comida del chef no es buena."
    }
  },
  {
    countryCodes: ['MA'],
    countryName: "Morocco",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在摩洛哥吃飯，通常會從共用的圓盤中取用食物。",
      [TargetLanguage.English]: "Did you know? In Morocco, people usually eat from a shared communal plate.",
      [TargetLanguage.Japanese]: "知っていますか？モロッコでは通常、大きな皿を共有して食事をします。",
      [TargetLanguage.Korean]: "알고 계셨나요? 모로코에서는 보통 커다란 공용 접시 하나에서 음식을 함께 나눠 먹습니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Maroc, mọi người thường ăn chung từ một đĩa lớn dùng chung.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในโมร็อกโก การกินข้าวมักจะตักแบ่งกินจากจานกลางใบใหญ่ร่วมกัน",
      [TargetLanguage.French]: "Le saviez-vous ? Au Maroc, on mange généralement tous dans un grand plat commun.",
      [TargetLanguage.Spanish]: "¿Sabías que? En Marruecos, la gente suele comer de un plato común compartido."
    }
  },
  {
    countryCodes: ['BG'],
    countryName: "Bulgaria",
    content: {
      [TargetLanguage.ChineseTW]: "你知道嗎？在保加利亞點頭代表不同意，搖頭反而代表同意。",
      [TargetLanguage.English]: "Did you know? In Bulgaria, nodding means \"no\" and shaking your head means \"yes.\"",
      [TargetLanguage.Japanese]: "知っていますか？ブルガリアでは、頷くと「いいえ」、首を振ると「はい」を意味します。",
      [TargetLanguage.Korean]: "알고 계셨나요? 불가리아에서는 고개를 끄덕이면 아니오, 가로저으면 예를 의미합니다.",
      [TargetLanguage.Vietnamese]: "Bạn có biết? Ở Bulgaria, gật đầu nghĩa là không, còn lắc đầu lại nghĩa là đồng ý.",
      [TargetLanguage.Thai]: "รู้หรือไม่? ในบัลแกเรีย การพยักหน้าหมายถึงไม่ แต่การส่ายหน้าหมายถึงใช่",
      [TargetLanguage.French]: "Le saviez-vous ? En Bulgarie, hocher la tête signifie « non » et secouer la tête signifie « oui ».",
      [TargetLanguage.Spanish]: "¿Sabías que? En Bulgaria, asentir con la cabeza significa \"no\" y negar con la cabeza significa \"sí\"."
    }
  }
];
