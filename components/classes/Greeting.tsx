import React from 'react';

export default function Greeting({ firstName }: { firstName: string}) {
    function getGreetingText(): string {
      const date = new Date(Date.now());
      const hours = date.getHours();
  
      if (hours < 12 && hours >= 4) {
        return `Good morning, ${firstName}`;
      }
  
      if (hours >= 12 && hours < 18) {
        return `Good afternoon, ${firstName}`;
      }
  
      if (hours >= 18 && hours < 23) {
        return `Good evening, ${firstName}`;
      }
  
      if (hours >= 23 || hours <= 4) {
        return `Good night, ${firstName}`;
      }
  
      return `Good afternoon, ${firstName}`;
    }
    return (
      <div className="p-3 bg-dark text-light shadow">
        <h2 className="ms-3">{getGreetingText()}</h2>
      </div>
    );
  }