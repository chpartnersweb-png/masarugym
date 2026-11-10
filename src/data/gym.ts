export const gym = {
  name: 'まさるボクシングジム',
  phone: '059-229-0750',
  phoneHref: 'tel:0592290750',
  instagram: 'https://www.instagram.com/masarugym/',
  email: 'masaruboxinggym@sage.ocn.ne.jp',
  address: '三重県津市東丸之内18-16 長谷部ビル2・3F',
  postalCode: '514-0028',
  parkingAddress: '三重県津市東丸之内17-13',
  admissionFee: '7,700',
  administrationFee: '3,300',
};

export const fees = [
  { label: '一般', price: '11,000' },
  { label: '大学生・専門学校生', price: '9,900' },
  { label: '高校生', price: '8,800' },
  { label: 'U.J（小・中学生）', price: '7,700' },
  { label: '女性', price: '8,800' },
  { label: 'シニア（65歳以上）', price: '8,800' },
];

// 実施期間と条件が確定してから有効にします。開始・終了は日本時間、終了時刻も含みます。
// ブラウザで期間を判断するため、静的公開後も期間外の告知は表示されません。
export const campaign = {
  enabled: false,
  startsAt: '', // 例: 2027-04-01T00:00:00+09:00
  endsAt: '', // 例: 2027-05-31T23:59:59+09:00
  title: '入会金無料キャンペーン',
  description: '', // 対象者・人数・申込条件など、確定した内容を記載
};

// 追加記事は実際に提供された内容のみ登録。date は YYYY-MM-DD 形式。
export const news: { date: string; category: string; title: string; body: string }[] = [];
