export const formatCurrencyNummber = (value: number) => {
    const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    return formatted;
}

export  const calculateAge=(dateOfBirth) =>{
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if the birthday hasn't occurred this year yet
    const currentMonth = today.getMonth() + 1;
    const birthMonth = birthDate.getMonth() + 1;
  
    if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDate.getDate() > today.getDate())) {
        age--;
    }
  
    return age;
  }