export const useOrderTimer=(time:string):boolean=>{
    const isWithinOneMinute = (): boolean => {
        const currentTime = new Date();
    
        const [datePart, timePart] = time.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        const inputTime = new Date(year, month - 1, day, hour, minute, second);
        const difference = currentTime.getTime() - inputTime.getTime();
        const differenceInSeconds = difference / 1000;
        return differenceInSeconds >= 0 && differenceInSeconds <= 60;
    };

    return isWithinOneMinute();
}