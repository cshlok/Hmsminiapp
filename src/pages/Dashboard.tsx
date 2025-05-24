import React, { useEffect } from 'react';
import { useAppSelector } from '../store';
import { 
  Users, 
  Calendar, 
  Package, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { patients } = useAppSelector(state => state.patient);
  const { appointments } = useAppSelector(state => state.appointment);
  const { services } = useAppSelector(state => state.service);
  const { quotes } = useAppSelector(state => state.quote);
  const { bills } = useAppSelector(state => state.billing);
  const { clinicInfo } = useAppSelector(state => state.settings);
  
  // Get today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appointment => 
    appointment.date === today && appointment.status !== 'cancelled'
  );
  
  // Get pending bills
  const pendingBills = bills.filter(bill => 
    bill.status === 'pending' || bill.status === 'partially_paid'
  );
  
  // Get upcoming appointments (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];
  
  const upcomingAppointments = appointments.filter(appointment => 
    appointment.date > today && 
    appointment.date <= nextWeekStr && 
    appointment.status !== 'cancelled'
  );
  
  // Get recent quotes
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Stats cards data
  const statsCards = [
    { 
      title: 'Total Patients', 
      value: patients.length, 
      icon: <Users size={24} className="text-blue-500" />,
      link: '/patients'
    },
    { 
      title: "Today's Appointments", 
      value: todayAppointments.length, 
      icon: <Calendar size={24} className="text-green-500" />,
      link: '/appointments'
    },
    { 
      title: 'Active Services', 
      value: services.filter(s => s.active).length, 
      icon: <Package size={24} className="text-purple-500" />,
      link: '/services'
    },
    { 
      title: 'Pending Bills', 
      value: pendingBills.length, 
      icon: <DollarSign size={24} className="text-red-500" />,
      link: '/billing'
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome to {clinicInfo.name}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Today's Appointments</h2>
            <Clock size={20} className="text-gray-400" />
          </div>
          
          <div className="p-6">
            {todayAppointments.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  const service = services.find(s => s.id === appointment.serviceId);
                  
                  return (
                    <Link 
                      key={appointment.id} 
                      to={`/appointments/${appointment.id}`}
                      className="block p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {service ? service.name : 'Unknown Service'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.startTime}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.status === 'confirmed' ? (
                              <span className="text-green-500">Confirmed</span>
                            ) : (
                              <span className="text-yellow-500">Scheduled</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No appointments scheduled for today</p>
                <Link 
                  to="/appointments/new" 
                  className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Add Appointment
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-medium">Recent Quotes</h2>
            <FileText size={20} className="text-gray-400" />
          </div>
          
          <div className="p-6">
            {recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {recentQuotes.map((quote) => {
                  const patient = patients.find(p => p.id === quote.patientId);
                  
                  return (
                    <Link 
                      key={quote.id} 
                      to={`/quotes/${quote.id}`}
                      className="block p-4 border rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{quote.title}</p>
                          <p className="text-sm text-gray-500">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote.total)}</p>
                          <p className="text-sm">
                            {quote.status === 'accepted' ? (
                              <span className="text-green-500">Accepted</span>
                            ) : quote.status === 'sent' ? (
                              <span className="text-blue-500">Sent</span>
                            ) : quote.status === 'draft' ? (
                              <span className="text-gray-500">Draft</span>
                            ) : (
                              <span className="text-red-500">{quote.status}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No quotes created yet</p>
                <Link 
                  to="/quotes/new" 
                  className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Create Quote
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">Upcoming Appointments</h2>
          <TrendingUp size={20} className="text-gray-400" />
        </div>
        
        <div className="p-6">
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    const service = services.find(s => s.id === appointment.serviceId);
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/patients/${appointment.patientId}`} className="text-primary hover:underline">
                            {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service ? service.name : 'Unknown Service'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.startTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No upcoming appointments in the next 7 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
