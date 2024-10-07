import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';

export function Card() {
  const [skills, setSkills] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedTechStack, setSelectedTechStack] = useState([]);

  // Dummy data to simulate API response
  const dummyData = [
    {
      skillName: 'UI/UX',
      skillImage: 'https://img-c.udemycdn.com/course/750x422/531148_b0a2_4.jpg',
      techStack: [
        { name: 'Bootstrap' },
        { name: 'Tailwind CSS' },
        { name: 'Figma' },
      ],
    },
    {
      skillName: 'Full Stack',
      skillImage: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20190626123927/untitlsssssed.png',
      techStack: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'Express' },
      ],
    },
    
    {
      skillName: 'Data Engineering',
      skillImage: 'https://www.kdnuggets.com/wp-content/uploads/c_beginner_guide_data_engineering_1.png',
      techStack: [
        { name: 'Azure Data Factory' },
        { name: 'SQL' },
        { name: 'Web Scraping' },
      ],
    },
   
    {
      skillName: 'Software Testing',
      skillImage: 'https://www.testingmind.com/wp-content/uploads/2022/11/623b0aa81f62670d19d49d2f_What-are-the-11-ways-your-company-can-do-software-testing-more-efficiently_-2-100-1.jpg',
      techStack: [
        { name: 'Java' },
        { name: 'Playwright' },
        { name: 'Appium' },
      ],
    },
    {
      skillName: 'Data Science',
      skillImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2RzGeikAnS5cPgbYPavFrQmzbb6FVoTjWPw&s',
      techStack: [
        { name: 'Python' },
        { name: 'Databricks' },
        { name: 'Machine Learning' },
      ],
    },
  ];

  useEffect(() => {
    // Simulating API data fetching
    setSkills(dummyData);
  }, []);

  const responsiveOptions = [
    { breakpoint: "1440px", numVisible: 4, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
  ];

  const Popup = ({ show, onClose, techStack }) => {
    if (!show) return null;
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Tech Stack</h3>
            <Button onClick={onClose} className="p-button-danger " icon="pi pi-times" />
          </div>
          <ul className='d-flex flex-wrap justify-content-around  pt-3 '>
            {techStack && techStack.length > 0 ? (
              techStack.map((tech, index) => (
                <span key={index}>
                  <Button label={tech.name} className='p-button-rounded'/>
                </span>
              ))
            ) : (
              <li>No tech stack information available.</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const handleTagClick = (techStack) => {
    setSelectedTechStack(techStack);
    setPopupVisible(true);
  };

  const employeeTemplate = (skill) => {
    return (
      <div className="card border-1 m-4 surface-border border-round text-center shadow-2" style={{ width: "80%" }}>
        <div className="mb-3">
          <Avatar
            image={skill.skillImage}
            size="xlarge"
            style={{ width: "250px", height: "150px", margin: "5px" }}
          />
        </div>
        <div>
          <h4 className="mb-2 text-xl font-bold">{skill.skillName}</h4>
          <Tag 
            value={`Tech stack`} 
            className="mb-3" 
            style={{ cursor: "pointer" }} 
            onClick={() => handleTagClick(skill.techStack)} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5 mx-10">
      <Carousel
        value={skills}
        numScroll={1}
        numVisible={4}
        responsiveOptions={responsiveOptions}
        itemTemplate={employeeTemplate}
      />
      <Popup
        show={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        techStack={selectedTechStack}
      />
    </div>
  );
}
