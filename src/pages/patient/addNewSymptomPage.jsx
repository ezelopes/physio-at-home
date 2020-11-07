import React, { useState } from 'react';
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
  const [selectedBodyPart, setBodyPart] = useState('Knee');
  const [specificBodyPart, setSpecificBodyPart] = useState('');

  const [minRightAngle, setMinRightAngle] = useState(180);
  const [maxRightAngle, setMaxRightAngle] = useState(0);

  const [minLeftAngle, setMinLeftAngle] = useState(180);
  const [maxLeftAngle, setMaxLeftAngle] = useState(0);

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
          prevStep={prevStep}
          nextStep={nextStep}
          setMinRightAngle={setMinRightAngle}
          setMaxRightAngle={setMaxRightAngle}
          setMinLeftAngle={setMinLeftAngle}
          setMaxLeftAngle={setMaxLeftAngle}
        />;
      case 3:
        return <StepFour
          prevStep={prevStep}
          symptomTitle={symptomTitle} 
          painRangeValue={painRangeValue} 
          symptomDetails={symptomDetails} 
          selectedBodyPart={selectedBodyPart} 
          specificBodyPart={specificBodyPart}
          minRightAngle={minRightAngle}
          maxRightAngle={maxRightAngle}
          minLeftAngle={minLeftAngle}
          maxLeftAngle={maxLeftAngle}
        />;
      default:
        return <p> Step not found. Refresh the page! </p>;
    }
  }

  return (
    <>
      <ToastContainer />

      <Form id='addSymptomForm'> 

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

export default AddNewSymptomPage;