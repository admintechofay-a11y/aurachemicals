import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Droplets, Atom, Globe, FlaskConical, ShieldCheck, ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      title: 'Active Pharmaceutical Ingredients',
      count: '94 Monographs',
      icon: Pill,
      link: '/products?category=api',
    },
    {
      title: 'Industrial Solvents',
      count: '20 Chemical Lines',
      icon: Droplets,
      link: '/products?category=solvents',
    },
    {
      title: 'Manufactured Phosphates',
      count: '11 Salt Grades',
      icon: Atom,
      link: '/products?category=manufacturing-phosphates',
    },
    {
      title: 'Direct Global Imports',
      count: '5 Sourcing Lines',
      icon: Globe,
      link: '/products?category=imports',
    },
    {
      title: 'Commercial Acids',
      count: '6 Industrial Lines',
      icon: FlaskConical,
      link: '/products?category=acids',
    },
    {
      title: 'Inspection & NDT Services',
      count: 'Level III Consulting',
      icon: ShieldCheck,
      link: '/services',
    },
  ];

  return (
    <section className="section" style={{ padding: 'clamp(40px, 5vw, 64px) 0' }}>
      <Container>
        <div className="home-section-header">
          <h2 className="home-section-title">What we supply</h2>
          <p className="home-section-sub">
            Direct supply across 6 core chemical categories.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((c) => {
            const IconComponent = c.icon;
            return (
              <Link to={c.link} key={c.title} className="category-card">
                <div className="category-card-top">
                  <div className="category-icon-circle">
                    <IconComponent size={22} />
                  </div>
                  <ArrowRight size={18} className="category-arrow" />
                </div>
                <div>
                  <h3 className="category-card-title">{c.title}</h3>
                  <span className="category-card-count">{c.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
