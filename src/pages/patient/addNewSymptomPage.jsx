import React, { memo, useState } from 'react';
import { Form } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify';
import { Stepper } from 'react-form-stepper';

import 'react-toastify/dist/ReactToastify.css';

import StepOne from '../../components/SymptomForm/StepOne'
import StepTwo from '../../components/SymptomForm/StepTwo'
import StepThree from '../../components/SymptomForm/StepThree'
import StepFour from '../../components/SymptomForm/StepFour'

const AddNewSymptomPage = () => {

  const [currentStep, setCurrentStep] = useState(0);
  const [symptomTitle, setSymptomTitle] = useState('');
  const [painRangeValue, setPainRangeValue] = useState(0);
  const [symptomDetails, setSymptomDetails] = useState('');
  const [rightOrLeft, setRightOrLeft] = useState('RIGHT');
  const [selectedBodyPart, setBodyPart] = useState('KNEE');
  const [specificBodyPart, setSpecificBodyPart] = useState([]);

  const [minAngle, setMinAngle] = useState(180);
  const [maxAngle, setMaxAngle] = useState(0);

  const nextStep = () => { setCurrentStep(currentStep + 1); }
  const prevStep = () => { setCurrentStep(currentStep - 1); }

  const renderSwitchForm = (currentStep) => {
    switch(currentStep) {
      case 0:
        return <StepOne
          nextStep={nextStep}
          setSymptomTitle={setSymptomTitle}
          symptomTitle={symptomTitle}
          setPainRangeValue={setPainRangeValue}
          painRangeValue={painRangeValue}
          setBodyPart={setBodyPart}
          selectedBodyPart={selectedBodyPart}
          setRightOrLeft={setRightOrLeft}
          rightOrLeft={rightOrLeft}
          setSpecificBodyPart={setSpecificBodyPart}
        />;
      case 1:
        return <StepTwo
          selectedBodyPart={selectedBodyPart}
          prevStep={prevStep}
          nextStep={nextStep}
          setSpecificBodyPart={setSpecificBodyPart}
          specificBodyPart={specificBodyPart}
          setSymptomDetails={setSymptomDetails}
          symptomDetails={symptomDetails}
        />;
      case 2:
        return <StepThree
          selectedBodyPart={selectedBodyPart}
          rightOrLeft={rightOrLeft}
          prevStep={prevStep}
          nextStep={nextStep}
          setMinAngle={setMinAngle}
          setMaxAngle={setMaxAngle}
        />;
      case 3:
        return <StepFour
          prevStep={prevStep}
          symptomTitle={symptomTitle} 
          painRangeValue={painRangeValue} 
          symptomDetails={symptomDetails} 
          selectedBodyPart={selectedBodyPart}
          rightOrLeft={rightOrLeft}
          specificBodyPart={specificBodyPart}
          minAngle={minAngle}
          maxAngle={maxAngle}
        />;
      default:
        return <p> Step not found. Refresh the page! </p>;
    }
  }

  return (
    <>
      <ToastContainer />

      <Form id='addSymptomForm' onSubmit={e => e.preventDefault()}> 

        <Stepper
          activeStep={currentStep}
          steps={[
            { label: 'Main details' }, 
            { label: 'More details' }, 
            { label: 'Kinect Data' }, 
            { label: 'Submit' }
          ]}
          connectorStateColors={true}
          styleConfig={{
            activeBgColor: '#1976D2',
            completedBgColor: '#1976D2',
            inactiveBgColor: '#9E9E9E',
          }}
          connectorStyleConfig={{
            activeColor: '#1976D2',
            completedColor: '#1976D2',
          }}
        />
        <div>
          {renderSwitchForm(currentStep)}
        </div>
      </Form>
    </>
  );
}

export default memo(AddNewSymptomPage);