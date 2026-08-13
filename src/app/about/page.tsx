'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Eye as EyeIcon, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { api } from '@/lib/api';
import { ContentBlock, ContactInfo } from '@/types';
import { IMAGE } from '@/lib/assets';

interface BoardMember {
  id: string;
  full_name: string;
  title: string;
  bio?: string;
  image_url?: string;
  sort_order?: number;
  is_published?: boolean;
}

interface EmployeeUser {
  id: string;
  email?: string;
  full_name: string;
  role?: string;
  title: string;
  is_active?: boolean;
  avatar_url?: string;
}

// Animation Configurations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

function BoardMemberCard({ member }: { member: BoardMember }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative w-full h-72 bg-gray-100 overflow-hidden group">
        {member.image_url ? (
          <Image
            src={member.image_url}
            alt={member.full_name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-pcfi-green-100 flex items-center justify-center text-pcfi-green-700 font-bold text-3xl">
            {member.full_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-gray-900">{member.full_name}</h3>
          <p className="text-sm font-semibold text-pcfi-green-600 mb-3">{member.title}</p>
          {member.bio && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{member.bio}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeCard({ employee }: { employee: EmployeeUser }) {
  const titleText = employee.title ;

  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex items-center p-5 gap-4"
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-pcfi-green-100 shrink-0 border-2 border-pcfi-green-500 shadow-sm">
        {employee.avatar_url ? (
          <Image
            src={employee.avatar_url}
            alt={employee.full_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pcfi-green-700 font-bold text-xl">
            {employee.full_name ? employee.full_name.charAt(0) : 'E'}
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <h4 className="font-display text-base font-bold text-gray-900 truncate">{employee.full_name}</h4>
        <div className="flex items-center gap-1.5 text-xs text-pcfi-green-700 font-medium mt-1">
          <Briefcase className="w-3.5 h-3.5 shrink-0 text-pcfi-gold-600" />
          <span className="font-bold text-md text-pcfi-gold-500 truncate">{titleText}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const [blocks, setBlocks] = useState<Record<string, ContentBlock>>({});
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const fetchEmployeesFn = typeof api.getPublicEmployees === 'function'
          ? api.getPublicEmployees()
          : api.getEmployees();

        const [aboutRes, contactRes, boardRes, employeeRes] = await Promise.all([
          api.getAbout().catch((err) => { console.error('Error fetching About:', err); return null; }),
          api.getContactInfo().catch((err) => { console.error('Error fetching Contact:', err); return null; }),
          api.getBoardMembers().catch((err) => { console.error('Error fetching Board:', err); return null; }),
          fetchEmployeesFn.catch((err) => { console.error('Error fetching Employees:', err); return null; }),
        ]);

        // Helper to extract array from direct response OR { success, data } object
        const extractData = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.success && Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data)) return res.data;
          return [];
        };

        // Handle Content Blocks
        const aboutData = extractData(aboutRes);
        if (aboutData.length > 0) {
          const map: Record<string, ContentBlock> = {};
          aboutData.forEach((b: ContentBlock) => { map[b.key] = b; });
          setBlocks(map);
        }

        // Handle Contact Info
        if (contactRes?.data?.metadata) {
          setContact(contactRes.data.metadata as ContactInfo);
        } else if (contactRes?.metadata) {
          setContact(contactRes.metadata as ContactInfo);
        }

        // Handle Board Members
        const boardData = extractData(boardRes);
        setBoardMembers(boardData);

        // Handle Employees
        const empData = extractData(employeeRes);
        setEmployees(empData);

      } catch (error) {
        console.error('Unhandled error in AboutPage fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="relative bg-pcfi-green-800 py-16 text-center overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto px-4"
        >
          <motion.p variants={fadeInUp} className="text-pcfi-gold-400 font-semibold text-sm uppercase tracking-widest mb-2">
            Get to Know Us
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-display text-3xl md:text-5xl font-bold text-white">
            About Us
          </motion.h1>
        </motion.div>
      </section>

      {/* Company Intro Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading">Who We Are</p>
          <h2 className="section-heading">{blocks.about_company?.title || 'About PCFI'}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {isLoading
              ? 'Loading…'
              : blocks.about_company?.content ||
                'PCFI Pvt. Ltd. is a trusted manufacturer of high-quality bale silage, dedicated to improving livestock nutrition and supporting sustainable agricultural practices.'}
          </p>
        </div>
      </motion.section>

      {/* Chairman Message */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-16 bg-pcfi-green-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp} className="flex justify-center lg:order-2">
              <div className="relative">
                <div className="w-52 h-64 bg-pcfi-green-200 rounded-2xl" />
                <div className="absolute -top-4 -left-4 w-52 h-64 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-60 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={IMAGE.chairman}
                      alt="Chairman"
                      width={192}
                      height={240}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="lg:order-1">
              <p className="section-subheading">Leadership</p>
              <h2 className="section-heading">Message from our Chairman</h2>
              <blockquote className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-pcfi-gold-500 pl-6">
                {blocks.chairman_message?.content ||
                  '"At Cattle Fodder Nepal, we are driven by a mission to empower farmers with sustainable, high-quality fodder solutions."'}
              </blockquote>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subheading">Our Purpose</p>
            <h2 className="section-heading">Mission & Vision</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="bg-pcfi-green-800 text-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-pcfi-gold-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-pcfi-gold-300 mb-3">
                {blocks.mission?.title || 'Our Mission'}
              </h3>
              <p className="text-pcfi-green-100 leading-relaxed text-sm">
                {blocks.mission?.content ||
                  'We are committed to empowering farmers and livestock owners with innovative, sustainable, and high-quality feed solutions.'}
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-pcfi-green-800 text-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-pcfi-gold-500 rounded-xl flex items-center justify-center mb-4">
                <EyeIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-pcfi-gold-300 mb-3">
                {blocks.vision?.title || 'Our Vision'}
              </h3>
              <p className="text-pcfi-green-100 leading-relaxed text-sm">
                {blocks.vision?.content ||
                  "To be Nepal's most trusted and innovative livestock feed manufacturer."}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Dynamic Board Members Showcase Panel */}
      {boardMembers.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="section-subheading">Governance & Strategy</p>
              <h2 className="section-heading">Board of Directors</h2>
            </div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {boardMembers.map((member) => (
                <BoardMemberCard key={member.id} member={member} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Dynamic Employees / Team Showcase Panel */}
      {employees.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="section-subheading">Dedicated Team</p>
              <h2 className="section-heading">Meet Our Team</h2>
            </div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
            >
              {employees.map((emp) => (
                <EmployeeCard key={emp.id} employee={emp} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Strip */}
      {contact && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="py-16 bg-gray-50 border-t border-gray-100"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="section-heading">Get in Touch</h2>
            <p className="text-gray-500 mb-8">We'd love to hear from you.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <a href={`tel:${contact.phone}`} className="card p-6 hover:border-pcfi-green-300 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <Phone className="w-6 h-6 text-pcfi-green-600 mb-2" />
                <span className="text-sm text-gray-700">{contact.phone}</span>
              </a>
              <a href={`mailto:${contact.email}`} className="card p-6 hover:border-pcfi-green-300 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <Mail className="w-6 h-6 text-pcfi-green-600 mb-2" />
                <span className="text-sm text-gray-700">{contact.email}</span>
              </a>
              <div className="card p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
                <MapPin className="w-6 h-6 text-pcfi-green-600 mb-2" />
                <span className="text-sm text-gray-700">{contact.address}</span>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </PublicLayout>
  );
}