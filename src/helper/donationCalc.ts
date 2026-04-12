type donationData = {
  receivedTime: string;
  amount: number;
  username: string;
  userId: string;
  message: string;
};

const REGEXP = /^(.+?)(?:\*(\d+))?$/;

const donationCalc = (data: donationData) => {
  const match = data.message.match(REGEXP);
  if (match) {
    const name = match[1].trim();
    const amount = parseInt(match[2] || '1', 10);
    const priceList = window.electron.getStore('setup.priceList');
    const price = priceList.find((item) => item === data.amount / amount);
    return price ? { name, amount, price } : null;
  }
};

export default donationCalc;
