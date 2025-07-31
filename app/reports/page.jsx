
"use client";

import React, { useState, useRef } from "react";
import { 
  Upload, 
  FileText, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Heart,
  Zap,
  Shield
} from "lucide-react";

export default function ReportsAnalyzer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Sample analysis results for demonstration
  const sampleAnalysis = {
    summary: {
      overallHealth: "Good",
      riskFactors: ["Vitamin D Deficiency", "Elevated Stress Markers"],
      recommendations: [
        "Increase Vitamin D supplementation",
        "Consider stress management techniques",
        "Regular exercise recommended",
        "Follow-up blood work in 3 months"
      ],
      confidence: 92
    },
    keyFindings: [
      {
        category: "Blood Chemistry",
        status: "normal",
        details: "All major markers within normal range",
        values: ["Glucose: 89 mg/dL", "Cholesterol: 180 mg/dL", "Hemoglobin: 14.2 g/dL"]
      },
      {
        category: "Vitamin Levels",
        status: "concern",
        details: "Vitamin D deficiency detected",
        values: ["Vitamin D: 18 ng/mL (Low)", "B12: 450 pg/mL (Normal)", "Folate: 12 ng/mL (Normal)"]
      },
      {
        category: "Inflammatory Markers",
        status: "elevated",
        details: "Mild inflammation indicators present",
        values: ["CRP: 4.2 mg/L (Elevated)", "ESR: 25 mm/hr (Slightly High)"]
      }
    ],
    trends: [
      { month: "Jan", score: 75 },
      { month: "Feb", score: 78 },
      { month: "Mar", score: 82 },
      { month: "Apr", score: 85 },
      { month: "May", score: 88 },
      { month: "Jun", score: 92 }
    ],
    mentalHealthInsights: {
      stressLevel: "Moderate",
      sleepQuality: "Good",
      cognitiveFunction: "Excellent",
      moodStability: "Stable"
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      status: "uploaded",
      file: file
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const analyzeReport = async (file) => {
    setAnalyzing(true);
    setSelectedFile(file);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults(sampleAnalysis);
      setAnalyzing(false);
      
      // Update file status
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, status: "analyzed", analysis: sampleAnalysis }
            : f
        )
      );
    }, 3000);
  };

  const deleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setAnalysisResults(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "normal": return "text-green-600 bg-green-100";
      case "concern": return "text-yellow-600 bg-yellow-100";
      case "elevated": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "normal": return <CheckCircle className="w-4 h-4" />;
      case "concern": return <AlertCircle className="w-4 h-4" />;
      case "elevated": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧬 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Medical Reports Analyzer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your medical reports and get instant AI-powered insights about your health trends and recommendations
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">Instant Results</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Reports
              </h2>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Blood test reports</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Radiology reports</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Prescription records</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mental health assessments</span>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Uploaded Files ({uploadedFiles.length})</h3>
              
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No files uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        <p className="text-xs text-gray-400">
                          {file.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {file.status === "analyzed" ? (
                          <button
                            onClick={() => {
                              setSelectedFile(file);
                              setAnalysisResults(file.analysis);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded"
                            title="View Analysis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => analyzeReport(file)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="Analyze"
                          >
                            <Brain className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2">
            {analyzing ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Analyzing Your Report...</h3>
                <p className="text-gray-600">Our AI is processing your medical data and generating insights</p>
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <Brain className="w-5 h-5" />
                    <span className="font-medium">AI Analysis in Progress</span>
                  </div>
                </div>
              </div>
            ) : analysisResults ? (
              <div className="space-y-6">
                
                {/* Summary Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Analysis Summary</h2>
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">{analysisResults.summary.confidence}% Confidence</span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Overall Health Status
                      </h3>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-bold text-lg">{analysisResults.summary.overallHealth}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        Risk Factors
                      </h3>
                      <div className="space-y-2">
                        {analysisResults.summary.riskFactors.map((risk, idx) => (
                          <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                            <span className="text-yellow-800 text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Key Findings
                  </h3>
                  
                  <div className="space-y-4">
                    {analysisResults.keyFindings.map((finding, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{finding.category}</h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${getStatusColor(finding.status)}`}>
                            {getStatusIcon(finding.status)}
                            <span className="capitalize">{finding.status}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{finding.details}</p>
                        <div className="flex flex-wrap gap-2">
                          {finding.values.map((value, vidx) => (
                            <span key={vidx} className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mental Health Insights */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Mental Health Insights
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(analysisResults.mentalHealthInsights).map(([key, value]) => (
                      <div key={key} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-purple-700 font-bold">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    AI Recommendations
                  </h3>
                  
                  <div className="grid gap-3">
                    {analysisResults.summary.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-orange-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition">
                      Schedule Consultation
                    </button>
                    <button className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition">
                      Download Report
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-600">Ready to Analyze</h3>
                <p className="text-gray-500 mb-6">Upload your medical reports to get AI-powered insights and recommendations</p>
                
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Upload</h4>
                    <p className="text-sm text-gray-500">Upload your medical reports securely</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Analyze</h4>
                    <p className="text-sm text-gray-500">AI processes and analyzes your data</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-1">Insights</h4>
                    <p className="text-sm text-gray-500">Get personalized health insights</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}
