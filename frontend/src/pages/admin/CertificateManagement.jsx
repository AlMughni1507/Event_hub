import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/ConfirmModal';
import { Award, Download, FileText, Eye, Settings } from 'lucide-react';
import { eventsAPI, certificatesAPI, registrationsAPI } from '../../services/api';

const CertificateManagement = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [generateConfirm, setGenerateConfirm] = useState({ show: false, participant: null });
  const [bulkGenerateConfirm, setBulkGenerateConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [certificateTemplate, setCertificateTemplate] = useState({
    title: 'CERTIFICATE',
    subtitle: 'OF ACHIEVEMENT',
    content: 'This is to certify that the above named has successfully completed the requirements and demonstrated exceptional performance in',
    footer: 'Awarded on this day',
    backgroundColor: '#ffffff',
    primaryColor: '#1e3a8a', // blue-900
    accentColor: '#fb923c', // orange-400
    textColor: '#374151', // gray-700
    logoPosition: 'top-center',
    signatureText: 'Event Organizer',
    certificateType: 'achievement' // achievement, participation, completion
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      if (response && response.data) {
        // Handle both array and object responses
        const eventsData = Array.isArray(response.data) ? response.data : response.data.events || [];
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      // Try to get participants from registrations API instead
      const response = await registrationsAPI.getAll({ event_id: eventId, status: 'approved' });
      if (response && response.data) {
        // Handle both array and object responses
        const participantsData = Array.isArray(response.data) ? response.data : response.data.registrations || [];
        setParticipants(participantsData);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipants([]); // Set empty array on error
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    fetchParticipants(event.id);
  };

  const generateCertificate = (participant) => {
    setGenerateConfirm({ show: true, participant });
  };

  const confirmGenerate = async () => {
    const participant = generateConfirm.participant;
    try {
      await certificatesAPI.generate(selectedEvent.id, participant.id);
      toast.success(`Certificate generated for ${participant.full_name || participant.user_name}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    }
  };

  const generateAllCertificates = () => {
    setBulkGenerateConfirm(true);
  };

  const confirmBulkGenerate = async () => {
    try {
      await certificatesAPI.generateBulk(selectedEvent.id);
      toast.success(`Generated certificates for all ${participants.length} participants`);
    } catch (error) {
      console.error('Error generating bulk certificates:', error);
      toast.error('Failed to generate certificates');
    }
  };

  const saveTemplate = async () => {
    try {
      await certificatesAPI.updateTemplate(certificateTemplate);
      toast.success('Certificate template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const resetTemplate = () => {
    setCertificateTemplate({
      title: 'CERTIFICATE',
      subtitle: 'OF ACHIEVEMENT',
      content: 'This is to certify that the above named has successfully completed the requirements and demonstrated exceptional performance in',
      footer: 'Awarded on this day',
      backgroundColor: '#ffffff',
      primaryColor: '#1e3a8a',
      accentColor: '#fb923c',
      textColor: '#374151',
      logoPosition: 'top-center',
      signatureText: 'Event Organizer',
      certificateType: 'achievement'
    });
  };

  const CertificatePreview = () => {
    const getSubtitleText = () => {
      switch(certificateTemplate.certificateType) {
        case 'participation': return 'OF PARTICIPATION';
        case 'completion': return 'OF COMPLETION';
        default: return 'OF ACHIEVEMENT';
      }
    };

    return (
      <div className="w-full h-96 relative overflow-hidden rounded-lg shadow-lg" style={{ backgroundColor: certificateTemplate.backgroundColor }}>
        {/* Background Design Elements */}
        <div className="absolute inset-0">
          {/* Accent curved element */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
            style={{ background: `linear-gradient(to bottom right, ${certificateTemplate.accentColor}, ${certificateTemplate.accentColor}dd)` }}
          ></div>
          {/* Primary curved element */}
          <div 
            className="absolute top-0 right-0 w-48 h-48 rounded-bl-full transform translate-x-8 -translate-y-8"
            style={{ background: `linear-gradient(to bottom right, ${certificateTemplate.primaryColor}, ${certificateTemplate.primaryColor}dd)` }}
          ></div>
          {/* Decorative lines */}
          <div className="absolute top-4 left-4 w-16 h-0.5" style={{ backgroundColor: certificateTemplate.primaryColor }}></div>
          <div className="absolute top-6 left-4 w-12 h-0.5" style={{ backgroundColor: certificateTemplate.accentColor }}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Header */}
          <div className="text-left mb-6">
            <h1 
              className="text-2xl font-bold tracking-wider mb-1"
              style={{ color: certificateTemplate.primaryColor }}
            >
              {certificateTemplate.title}
            </h1>
            <p 
              className="text-sm uppercase tracking-wide"
              style={{ color: certificateTemplate.textColor }}
            >
              {getSubtitleText()}
            </p>
          </div>

          {/* Participant Name */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-4">
              <div 
                className="text-3xl font-bold mb-2" 
                style={{ fontFamily: 'serif', color: certificateTemplate.textColor }}
              >
                [Participant Name]
              </div>
              <div className="w-32 h-0.5" style={{ backgroundColor: certificateTemplate.accentColor }}></div>
            </div>

            {/* Achievement Text */}
            <div className="mb-6">
              <p 
                className="text-sm leading-relaxed"
                style={{ color: certificateTemplate.textColor }}
              >
                {certificateTemplate.content}
              </p>
              <div 
                className="text-xl font-semibold mt-2"
                style={{ color: certificateTemplate.primaryColor }}
              >
                [Event Title]
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="text-xs mb-1" style={{ color: certificateTemplate.textColor, opacity: 0.7 }}>DATE</div>
              <div className="text-sm font-medium" style={{ color: certificateTemplate.textColor }}>[Event Date]</div>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: certificateTemplate.textColor, opacity: 0.7 }}>SIGNATURE</div>
              <div className="text-sm font-medium italic" style={{ color: certificateTemplate.textColor }}>{certificateTemplate.signatureText}</div>
            </div>
          </div>

          {/* Seal/Badge */}
          <div className="absolute bottom-8 right-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(to bottom right, ${certificateTemplate.accentColor}, ${certificateTemplate.accentColor}dd)` }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(to bottom right, ${certificateTemplate.primaryColor}, ${certificateTemplate.primaryColor}dd)` }}
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">🏆 Certificate Management</h1>
          <p className="text-gray-600">Generate and manage certificates for event participants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-black mb-4">Select Event</h2>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleEventSelect(event)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedEvent?.id === event.id
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-75">
                      {new Date(event.event_date).toLocaleDateString('id-ID')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template Editor Button */}
          <button
            onClick={() => setShowTemplateEditor(!showTemplateEditor)}
            className="w-full mt-4 bg-black text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            {showTemplateEditor ? 'Hide' : 'Edit'} Certificate Template
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {showTemplateEditor ? (
            /* Template Editor */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-black mb-4">Certificate Template Editor</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Template Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={certificateTemplate.title}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={certificateTemplate.subtitle}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Text</label>
                    <textarea
                      rows="3"
                      value={certificateTemplate.content}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                    <input
                      type="text"
                      value={certificateTemplate.footer}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, footer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Signature Text</label>
                    <input
                      type="text"
                      value={certificateTemplate.signatureText}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, signatureText: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                    <select
                      value={certificateTemplate.certificateType}
                      onChange={(e) => setCertificateTemplate({...certificateTemplate, certificateType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors text-black"
                    >
                      <option value="achievement">Certificate of Achievement</option>
                      <option value="participation">Certificate of Participation</option>
                      <option value="completion">Certificate of Completion</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                      <input
                        type="color"
                        value={certificateTemplate.primaryColor}
                        onChange={(e) => setCertificateTemplate({...certificateTemplate, primaryColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                      <input
                        type="color"
                        value={certificateTemplate.accentColor}
                        onChange={(e) => setCertificateTemplate({...certificateTemplate, accentColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                      <input
                        type="color"
                        value={certificateTemplate.textColor}
                        onChange={(e) => setCertificateTemplate({...certificateTemplate, textColor: e.target.value})}
                        className="w-full h-10 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="border border-gray-300 rounded-xl p-2">
                    <div className="transform scale-50 origin-top-left">
                      <CertificatePreview />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button 
                  onClick={saveTemplate}
                  className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Save Template
                </button>
                <button 
                  onClick={resetTemplate}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          ) : selectedEvent ? (
            /* Participants and Certificate Generation */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-black">{selectedEvent.title}</h2>
                  <p className="text-gray-600">Participants: {participants.length}</p>
                </div>
                <button
                  onClick={generateAllCertificates}
                  className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  Generate All Certificates
                </button>
              </div>

              {participants.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-black">No participants</h3>
                  <p className="mt-1 text-sm text-gray-500">No one has registered for this event yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Participant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Registration Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-black">{participant.full_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{participant.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(participant.registration_date).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Confirmed
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => generateCertificate(participant)}
                              className="text-black hover:text-gray-700 mr-3"
                            >
                              Generate Certificate
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* No Event Selected */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-black">Select an event</h3>
              <p className="mt-1 text-sm text-gray-500">Choose an event from the list to manage certificates for its participants.</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Certificate Confirmation Modal */}
      <ConfirmModal
        isOpen={generateConfirm.show}
        onClose={() => setGenerateConfirm({ show: false, participant: null })}
        onConfirm={confirmGenerate}
        title="Generate Certificate"
        message={`Generate certificate untuk ${generateConfirm.participant?.full_name || generateConfirm.participant?.user_name}?`}
        confirmText="Ya, Generate"
        cancelText="Batal"
        type="info"
      />

      {/* Bulk Generate Certificates Confirmation Modal */}
      <ConfirmModal
        isOpen={bulkGenerateConfirm}
        onClose={() => setBulkGenerateConfirm(false)}
        onConfirm={confirmBulkGenerate}
        title="Bulk Generate Certificates"
        message={`Generate certificates untuk semua ${participants.length} participants dari event "${selectedEvent?.title}"?`}
        confirmText="Ya, Generate All"
        cancelText="Batal"
        type="warning"
      />
    </div>
  );
};

export default CertificateManagement;
