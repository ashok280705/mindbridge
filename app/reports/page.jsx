
"use client";

import { useState } from "react";
import { Upload, FileText, Brain, Download, Trash2, AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ReportsAnalyzerPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      file: file,
      status: 'uploaded'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const analyzeReport = async (fileId) => {
    setLoading(true);
    const file = uploadedFiles.find(f => f.id === fileId);
    
    // Update file status to analyzing
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? {...f, status: 'analyzing'} : f)
    );

    try {
      // Simulate AI analysis (replace with actual AI service)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock analysis based on file type
      const analysis = generateMockAnalysis(file);
      
      setAnalysisResults(prev => ({
        ...prev,
        [fileId]: analysis
      }));

      // Update file status to analyzed
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? {...f, status: 'analyzed'} : f)
      );

    } catch (error) {
      console.error('Analysis failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? {...f, status: 'error'} : f)
      );
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (file) => {
    const analysisTypes = [
      {
        type: 'Blood Test',
        findings: [
          'Vitamin D levels are below optimal range (18 ng/mL)',
          'Iron levels are within normal range',
          'Complete Blood Count shows normal values',
          'Thyroid function tests are normal'
        ],
        recommendations: [
          'Consider Vitamin D3 supplementation (1000-2000 IU daily)',
          'Increase sun exposure or dietary sources',
          'Follow up in 3 months',
          'Maintain healthy diet rich in iron'
        ],
        riskLevel: 'Low',
        summary: 'Overall health markers are good with minor Vitamin D deficiency that can be easily addressed.'
      },
      {
        type: 'Mental Health Assessment',
        findings: [
          'Moderate stress indicators present',
          'Sleep quality scores below average',
          'Anxiety levels slightly elevated',
          'Cognitive function within normal range'
        ],
        recommendations: [
          'Practice stress reduction techniques',
          'Establish regular sleep schedule (7-9 hours)',
          'Consider mindfulness or meditation',
          'Regular physical exercise recommended'
        ],
        riskLevel: 'Medium',
        summary: 'Some stress and sleep concerns that would benefit from lifestyle modifications and possibly professional support.'
      },
      {
        type: 'General Health Report',
        findings: [
          'BMI within healthy range',
          'Blood pressure normal',
          'Heart rate regular',
          'No significant abnormalities detected'
        ],
        recommendations: [
          'Continue current healthy lifestyle',
          'Regular health checkups annually',
          'Maintain balanced diet and exercise',
          'Monitor any changes in symptoms'
        ],
        riskLevel: 'Low',
        summary: 'Excellent overall health status. Continue preventive care and healthy habits.'
      }
    ];

    return analysisTypes[Math.floor(Math.random() * analysisTypes.length)];
  };

  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setAnalysisResults(prev => {
      const newResults = {...prev};
      delete newResults[fileId];
      return newResults;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 md:px-6 py-20 mt-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI Reports <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Analyzer</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your medical reports and get AI-powered insights and recommendations for better health management.
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Medical Reports</h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB
            </p>
            <label className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              Choose Files
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-600" />
              Uploaded Reports ({uploadedFiles.length})
            </h2>
            
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • Uploaded {file.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {file.status === 'uploaded' && (
                      <button
                        onClick={() => analyzeReport(file.id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Brain className="w-4 h-4" />
                        Analyze
                      </button>
                    )}
                    
                    {file.status === 'analyzing' && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </div>
                    )}
                    
                    {file.status === 'analyzed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Analyzed
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Error
                      </div>
                    )}
                    
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {Object.keys(analysisResults).length > 0 && (
          <div className="space-y-8">
            {Object.entries(analysisResults).map(([fileId, analysis]) => {
              const file = uploadedFiles.find(f => f.id === parseInt(fileId));
              return (
                <div key={fileId} className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Analysis: {file?.name}</h2>
                      <p className="text-gray-600">Report Type: {analysis.type}</p>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      analysis.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      analysis.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                      Risk Level: {analysis.riskLevel}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                    <p className="text-blue-800">{analysis.summary}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Findings */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        Key Findings
                      </h3>
                      <ul className="space-y-2">
                        {analysis.findings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                    <Link href="/mental-counselor">
                      <button className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                        <Brain className="w-4 h-4" />
                        Discuss with AI Counselor
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 mb-8">Upload your first medical report to get started with AI analysis.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mental-counselor">
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
                  Talk to AI Counselor
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
