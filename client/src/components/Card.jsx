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
      skillName: 'Full Stack',
      skillImage: 'https://via.placeholder.com/300x200?text=JavaScript',
      techStack: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'Express' },
      ],
    },
    {
      skillName: 'Data Science',
      skillImage: 'https://via.placeholder.com/300x200?text=Python',
      techStack: [
        { name: 'Python' },
        { name: 'Databricks' },
        { name: 'Machine Learning' },
      ],
    },
    {
      skillName: 'Data Engineering',
      skillImage: 'https://via.placeholder.com/300x200?text=Java',
      techStack: [
        { name: 'Azure Data Factory' },
        { name: 'SQL' },
        { name: 'Web Scraping' },
      ],
    },
    {
      skillName: 'UI/UX',
      skillImage: 'https://via.placeholder.com/300x200?text=CSS',
      techStack: [
        { name: 'Bootstrap' },
        { name: 'Tailwind CSS' },
        { name: 'Figma' },
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
      <div className="card border-1 m-4 surface-border border-round text-center shadow-2" style={{ width: "90%" }}>
        <div className="mb-3">
          <Avatar
            image={skill.skillImage}
            size="xlarge"
            style={{ width: "300px", height: "200px", margin: "5px" }}
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
    <div className="mt-5 mx-5">
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
