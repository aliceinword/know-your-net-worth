import React, { useState } from 'react';

const EmailFormModal = ({ formData, currentUser, userRole, onClose }) => {
  const [emailData, setEmailData] = useState({
    recipientEmail: '',
    recipientName: '',
    subject: `Financial Disclosure Form - ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`,
    message: `Dear Attorney,

Please find attached the completed Financial Disclosure Statement for review.

Form Details:
- Filed by: ${currentUser.name} (${userRole.charAt(0).toUpperCase() + userRole.slice(1)})
- Completed on: ${new Date().toLocaleDateString()}
- Total sections completed: ${Object.keys(formData).filter(key => Object.keys(formData[key]).length > 0).length}

The form includes comprehensive information on:
• Family Data and Personal Information
• Income and Employment Details
• Assets and Property Holdings
• Liabilities and Debts
• Monthly Expenses

Please review at your earliest convenience and advise on any additional requirements.

Best regards,
${currentUser.name}`,
    includeFormData: true,
    includeCourtFormat: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Create form summary for email
      const formSummary = {
        metadata: {
          submittedBy: currentUser.name,
          userRole: userRole,
          submittedAt: new Date().toISOString(),
          completionStatus: Object.entries(formData).map(([section, data]) => ({
            section: section.charAt(0).toUpperCase() + section.slice(1),
            fieldsCompleted: Object.keys(data).length,
            isEmpty: Object.keys(data).length === 0
          }))
        },
        formData: emailData.includeFormData ? formData : null
      };

      // Simulate email sending (in a real app, this would call your backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demonstration, we'll create a downloadable file instead
      const emailPackage = {
        to: emailData.recipientEmail,
        subject: emailData.subject,
        message: emailData.message,
        attachment: formSummary
      };

      const dataStr = JSON.stringify(emailPackage, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `email-package-${userRole}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      setSubmitStatus('Email package created successfully! Check your downloads folder.');
      
    } catch (error) {
      setSubmitStatus('Error creating email package. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionStats = () => {
    const sections = Object.entries(formData);
    const completed = sections.filter(([_, data]) => Object.keys(data).length > 0).length;
    const total = sections.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const stats = getCompletionStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-scale">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Email Financial Form</h2>
                <p className="text-orange-100 text-sm">Send your completed form to legal counsel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">

          {/* Form Completion Status */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Form Completion Status</h3>
            <div className="text-sm text-blue-800">
              <p>Completed Sections: {stats.completed} of {stats.total} ({stats.percentage}%)</p>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={emailData.recipientName}
                  onChange={(e) => setEmailData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Attorney Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  required
                  value={emailData.recipientEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="attorney@lawfirm.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line *
              </label>
              <input
                type="text"
                required
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={8}
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeFormData"
                  checked={emailData.includeFormData}
                  onChange={(e) => setEmailData(prev => ({ ...prev, includeFormData: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeFormData" className="ml-2 block text-sm text-gray-700">
                  Include complete form data (JSON format)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeCourtFormat"
                  checked={emailData.includeCourtFormat}
                  onChange={(e) => setEmailData(prev => ({ ...prev, includeCourtFormat: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeCourtFormat" className="ml-2 block text-sm text-gray-700">
                  Include court-formatted Net Worth Statement (recommended for legal review)
                </label>
              </div>
            </div>

            {submitStatus && (
              <div className={`p-3 rounded-md ${
                submitStatus.includes('Error') 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-green-50 text-green-800 border border-green-200'
              }`}>
                {submitStatus}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Preparing...
                  </>
                ) : (
                  <>
                    📧 Send Email Package
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This creates a downloadable email package. In a production environment, 
              this would integrate with your email service to send directly to the recipient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailFormModal;