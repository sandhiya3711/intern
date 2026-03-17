const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", 
  "Kolkata", "Pune", "Jaipur", "Surat", "Indore", "Bhopal", "Vadodara", 
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan", 
  "Vasai", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", 
  "Navi Mumbai", "Allahabad", "Ranchi", "Howrah"
];

const NAMES = [
  "Aarav Sharma", "Aditi Rao", "Akash Gupta", "Ananya Singh", "Arjun Verma",
  "Bhavya Jain", "Chaitanya Reddy", "Deepak Kumar", "Esha Malhotra", "Fatima Khan",
  "Gautam Iyer", "Hansa Patel", "Ishaan Joshi", "Jaya Lakshmi", "Kabir Bose",
  "Kriti Sanon", "Madhav Nair", "Meera Kulkarni", "Nikhil Mehra", "Pooja Hegde",
  "Pranav Shah", "Riya Sen", "Rohan Das", "Sanya Mirza", "Siddharth Malhotra",
  "Tanvi Azmi", "Uday Chopra", "Vani Kapoor", "Varun Dhawan", "Zoya Akhtar"
];

export const generateMockData = (count = 1000) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)].split(' ')[0] + ' ' + (i % 100);
    const salary = Math.floor(Math.random() * (250000 - 45000) + 45000).toString();
    data.push({
      id: i.toString(),
      name: name,
      city: city,
      salary: salary
    });
  }
  return data;
};
