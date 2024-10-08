import React from 'react';
import { Card } from './context';

function Home(){
  return (
    <div className="d-flex justify-content-center">
      <Card
        txtcolor="black"
        header={(<div className="text-center">BadBank Landing Page</div>)}
        title={(<div className="text-center">Welcome to the Bank</div>)}
        text={(<div className="text-center">Please use the navigation bar above.</div>)}
        body={(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)}
      />
    </div>
  );  
}

export default Home;