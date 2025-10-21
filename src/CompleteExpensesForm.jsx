import React from 'react';

// Move MoneyInput outside the component to prevent recreation
const MoneyInput = ({ value, onChange, placeholder = "0.00" }) => (
  <div className="relative">
    <span className="absolute left-3 top-2 text-gray-500">$</span>
    <input
      type="number"
      step="0.01"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const CompleteExpensesForm = ({ formData = {}, updateFormData, userRole = 'plaintiff' }) => {
  // Safe number conversion function
  const toNumber = (value) => {
    if (value === '' || value === null || value === undefined) return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calculate section totals with safe conversion
  const housingTotal = (toNumber(formData.mortgage) + 
                       toNumber(formData.homeEquityLine) + 
                       toNumber(formData.realEstateTaxes) + 
                       toNumber(formData.homeownersInsurance) + 
                       toNumber(formData.hoaMaintenance) + 
                       toNumber(formData.rent) + 
                       toNumber(formData.otherHousing));

  const utilitiesTotal = (toNumber(formData.fuelOilGas) + 
                         toNumber(formData.electric) + 
                         toNumber(formData.landlinePhone) + 
                         toNumber(formData.mobilePhone) + 
                         toNumber(formData.cableSatellite) + 
                         toNumber(formData.internet) + 
                         toNumber(formData.alarm) + 
                         toNumber(formData.water) + 
                         toNumber(formData.otherUtilities));

  const foodTotal = (toNumber(formData.groceries) + 
                    toNumber(formData.diningOut) + 
                    toNumber(formData.otherFood));

  const clothingTotal = (toNumber(formData.clothingYourself) + 
                        toNumber(formData.clothingChildren) + 
                        toNumber(formData.dryCleaning) + 
                        toNumber(formData.otherClothing));

  const insuranceTotal = (toNumber(formData.lifeInsurance) + 
                         toNumber(formData.fireTheftLiability) + 
                         toNumber(formData.automotiveInsurance) + 
                         toNumber(formData.umbrellaPolicy) + 
                         toNumber(formData.medicalPlanYourself) + 
                         toNumber(formData.medicalPlanChildren) + 
                         toNumber(formData.dentalPlan) + 
                         toNumber(formData.opticalPlan) + 
                         toNumber(formData.disabilityInsurance) + 
                         toNumber(formData.workersCompensation) + 
                         toNumber(formData.longTermCare) + 
                         toNumber(formData.otherInsurance));

  const unreimbursedMedicalTotal = (toNumber(formData.medical) + 
                                   toNumber(formData.dental) + 
                                   toNumber(formData.optical) + 
                                   toNumber(formData.pharmaceutical) + 
                                   toNumber(formData.surgicalNursing) + 
                                   toNumber(formData.psychotherapy) + 
                                   toNumber(formData.otherMedical));

  const householdMaintenanceTotal = (toNumber(formData.repairsMaintenance) + 
                                    toNumber(formData.gardeningLandscaping) + 
                                    toNumber(formData.sanitationCarting) + 
                                    toNumber(formData.snowRemoval) + 
                                    toNumber(formData.extermination) + 
                                    toNumber(formData.otherHouseholdMaintenance));

  const householdHelpTotal = (toNumber(formData.domestic) + 
                             toNumber(formData.nannyAuPair) + 
                             toNumber(formData.babysitter) + 
                             toNumber(formData.otherHouseholdHelp));

  const automobileTotal = (toNumber(formData.leaseLoanPayments) + 
                          toNumber(formData.gasAndOil) + 
                          toNumber(formData.repairs) + 
                          toNumber(formData.carWash) + 
                          toNumber(formData.parkingTolls) + 
                          toNumber(formData.otherAutomobile));

  const educationTotal = (toNumber(formData.nurseryPreschool) + 
                         toNumber(formData.primarySecondary) + 
                         toNumber(formData.college) + 
                         toNumber(formData.postGraduate) + 
                         toNumber(formData.religiousInstruction) + 
                         toNumber(formData.schoolTransportation) + 
                         toNumber(formData.schoolSuppliesBooks) + 
                         toNumber(formData.schoolLunches) + 
                         toNumber(formData.tutoring) + 
                         toNumber(formData.schoolEvents) + 
                         toNumber(formData.extracurricularActivities) + 
                         toNumber(formData.otherEducation));

  const recreationalTotal = (toNumber(formData.vacations) + 
                            toNumber(formData.moviesTheatre) + 
                            toNumber(formData.music) + 
                            toNumber(formData.recreationClubs) + 
                            toNumber(formData.activitiesYourself) + 
                            toNumber(formData.healthClub) + 
                            toNumber(formData.summerCamp) + 
                            toNumber(formData.birthdayParties) + 
                            toNumber(formData.otherRecreational));

  const incomeTaxesTotal = (toNumber(formData.federalTaxes) + 
                           toNumber(formData.stateTaxes) + 
                           toNumber(formData.cityTaxes) + 
                           toNumber(formData.socialSecurityMedicare));

  const miscellaneousTotal = (toNumber(formData.beautyBarberSpa) + 
                             toNumber(formData.toiletriesNonPrescription) + 
                             toNumber(formData.booksMagazinesNewspapers) + 
                             toNumber(formData.giftsToOthers) + 
                             toNumber(formData.charitableContributions) + 
                             toNumber(formData.religiousOrganizationDues) + 
                             toNumber(formData.unionOrganizationDues) + 
                             toNumber(formData.commutationExpenses) + 
                             toNumber(formData.veterinarianPetExpenses) + 
                             toNumber(formData.childSupportPayments) + 
                             toNumber(formData.alimonyMaintenancePayments) + 
                             toNumber(formData.loanPayments) + 
                             toNumber(formData.unreimbursedBusinessExpenses) + 
                             toNumber(formData.safeDepositBoxRental));

  const otherTotal = (toNumber(formData.otherExpense1) + 
                     toNumber(formData.otherExpense2) + 
                     toNumber(formData.otherExpense3));

  const totalMonthlyExpenses = housingTotal + utilitiesTotal + foodTotal + clothingTotal + 
                              insuranceTotal + unreimbursedMedicalTotal + householdMaintenanceTotal + 
                              householdHelpTotal + automobileTotal + educationTotal + recreationalTotal + 
                              incomeTaxesTotal + miscellaneousTotal + otherTotal;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
        <h2 className="text-lg font-semibold text-orange-900">III. EXPENSES (MONTHLY)</h2>
        <p className="text-sm text-orange-800 mt-2">
          List your current expenses on a monthly basis. If there has been any change in these expenses during the recent past please indicate. 
          Items included under "other" should be listed separately with separate dollar amounts.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        
        {/* Housing */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-900">(a) Housing: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Mortgage/Co-op Loan</label>
              <MoneyInput value={formData.mortgage} onChange={(value) => updateFormData('expenses', 'mortgage', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Home Equity Line of Credit/Second Mortgage</label>
              <MoneyInput value={formData.homeEquityLine} onChange={(value) => updateFormData('expenses', 'homeEquityLine', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">3. Real Estate Taxes (if not included in mortgage payment)</label>
              <MoneyInput value={formData.realEstateTaxes} onChange={(value) => updateFormData('expenses', 'realEstateTaxes', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">4. Homeowners/Renter's Insurance</label>
              <MoneyInput value={formData.homeownersInsurance} onChange={(value) => updateFormData('expenses', 'homeownersInsurance', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5. Homeowner's Association/Maintenance charges/Condominium Charges</label>
              <MoneyInput value={formData.hoaMaintenance} onChange={(value) => updateFormData('expenses', 'hoaMaintenance', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6. Rent</label>
              <MoneyInput value={formData.rent} onChange={(value) => updateFormData('expenses', 'rent', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">7. Other</label>
              <MoneyInput value={formData.otherHousing} onChange={(value) => updateFormData('expenses', 'otherHousing', value)} />
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: HOUSING</span>
              <span className="font-bold text-orange-900">${housingTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Utilities */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(b) Utilities: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Fuel Oil/Gas</label><MoneyInput value={formData.fuelOilGas} onChange={(value) => updateFormData('expenses', 'fuelOilGas', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Electric</label><MoneyInput value={formData.electric} onChange={(value) => updateFormData('expenses', 'electric', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Telephone (land line)</label><MoneyInput value={formData.landlinePhone} onChange={(value) => updateFormData('expenses', 'landlinePhone', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Mobile Phone</label><MoneyInput value={formData.mobilePhone} onChange={(value) => updateFormData('expenses', 'mobilePhone', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Cable/Satellite TV</label><MoneyInput value={formData.cableSatellite} onChange={(value) => updateFormData('expenses', 'cableSatellite', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Internet</label><MoneyInput value={formData.internet} onChange={(value) => updateFormData('expenses', 'internet', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. Alarm</label><MoneyInput value={formData.alarm} onChange={(value) => updateFormData('expenses', 'alarm', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">8. Water</label><MoneyInput value={formData.water} onChange={(value) => updateFormData('expenses', 'water', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">9. Other</label><MoneyInput value={formData.otherUtilities} onChange={(value) => updateFormData('expenses', 'otherUtilities', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: UTILITIES</span>
              <span className="font-bold text-orange-900">${utilitiesTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Food */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(c) Food: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Groceries</label><MoneyInput value={formData.groceries} onChange={(value) => updateFormData('expenses', 'groceries', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Dining Out/Take Out</label><MoneyInput value={formData.diningOut} onChange={(value) => updateFormData('expenses', 'diningOut', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Other</label><MoneyInput value={formData.otherFood} onChange={(value) => updateFormData('expenses', 'otherFood', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: FOOD</span>
              <span className="font-bold text-orange-900">${foodTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Clothing */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(d) Clothing: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Yourself</label><MoneyInput value={formData.clothingYourself} onChange={(value) => updateFormData('expenses', 'clothingYourself', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Child(ren)</label><MoneyInput value={formData.clothingChildren} onChange={(value) => updateFormData('expenses', 'clothingChildren', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Dry Cleaning</label><MoneyInput value={formData.dryCleaning} onChange={(value) => updateFormData('expenses', 'dryCleaning', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Other</label><MoneyInput value={formData.otherClothing} onChange={(value) => updateFormData('expenses', 'otherClothing', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: CLOTHING</span>
              <span className="font-bold text-orange-900">${clothingTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(e) Insurance: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Life</label><MoneyInput value={formData.lifeInsurance} onChange={(value) => updateFormData('expenses', 'lifeInsurance', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Fire, theft and liability and personal articles policy</label><MoneyInput value={formData.fireTheftLiability} onChange={(value) => updateFormData('expenses', 'fireTheftLiability', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Automotive</label><MoneyInput value={formData.automotiveInsurance} onChange={(value) => updateFormData('expenses', 'automotiveInsurance', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Umbrella Policy</label><MoneyInput value={formData.umbrellaPolicy} onChange={(value) => updateFormData('expenses', 'umbrellaPolicy', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Medical Plan</label><MoneyInput value={formData.medicalPlanYourself} onChange={(value) => updateFormData('expenses', 'medicalPlanYourself', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5B. Medical Plan for children</label><MoneyInput value={formData.medicalPlanChildren} onChange={(value) => updateFormData('expenses', 'medicalPlanChildren', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Dental Plan</label><MoneyInput value={formData.dentalPlan} onChange={(value) => updateFormData('expenses', 'dentalPlan', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. Optical Plan</label><MoneyInput value={formData.opticalPlan} onChange={(value) => updateFormData('expenses', 'opticalPlan', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">8. Disability</label><MoneyInput value={formData.disabilityInsurance} onChange={(value) => updateFormData('expenses', 'disabilityInsurance', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">9. Worker's Compensation</label><MoneyInput value={formData.workersCompensation} onChange={(value) => updateFormData('expenses', 'workersCompensation', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">10. Long Term Care Insurance</label><MoneyInput value={formData.longTermCare} onChange={(value) => updateFormData('expenses', 'longTermCare', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">11. Other</label><MoneyInput value={formData.otherInsurance} onChange={(value) => updateFormData('expenses', 'otherInsurance', value)} /></div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5A. Medical Plan for yourself (Including name of carrier and name of insured)</label>
              <textarea
                value={formData.medicalPlanYourselfDetails || ''}
                onChange={(e) => updateFormData('expenses', 'medicalPlanYourselfDetails', e.target.value)}
                placeholder="Carrier name and insured name"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5B. Medical Plan for children (Including name of carrier and name of insured)</label>
              <textarea
                value={formData.medicalPlanChildrenDetails || ''}
                onChange={(e) => updateFormData('expenses', 'medicalPlanChildrenDetails', e.target.value)}
                placeholder="Carrier name and insured name"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: INSURANCE</span>
              <span className="font-bold text-orange-900">${insuranceTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Unreimbursed Medical */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(f) Unreimbursed Medical: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Medical</label><MoneyInput value={formData.medical} onChange={(value) => updateFormData('expenses', 'medical', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Dental</label><MoneyInput value={formData.dental} onChange={(value) => updateFormData('expenses', 'dental', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Optical</label><MoneyInput value={formData.optical} onChange={(value) => updateFormData('expenses', 'optical', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Pharmaceutical</label><MoneyInput value={formData.pharmaceutical} onChange={(value) => updateFormData('expenses', 'pharmaceutical', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Surgical, Nursing, Hospital</label><MoneyInput value={formData.surgicalNursing} onChange={(value) => updateFormData('expenses', 'surgicalNursing', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Psychotherapy</label><MoneyInput value={formData.psychotherapy} onChange={(value) => updateFormData('expenses', 'psychotherapy', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. Other</label><MoneyInput value={formData.otherMedical} onChange={(value) => updateFormData('expenses', 'otherMedical', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: UNREIMBURSED MEDICAL</span>
              <span className="font-bold text-orange-900">${unreimbursedMedicalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Household Maintenance */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(g) Household Maintenance: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Repairs/Maintenance</label><MoneyInput value={formData.repairsMaintenance} onChange={(value) => updateFormData('expenses', 'repairsMaintenance', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Gardening/landscaping</label><MoneyInput value={formData.gardeningLandscaping} onChange={(value) => updateFormData('expenses', 'gardeningLandscaping', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Sanitation/carting</label><MoneyInput value={formData.sanitationCarting} onChange={(value) => updateFormData('expenses', 'sanitationCarting', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Snow Removal</label><MoneyInput value={formData.snowRemoval} onChange={(value) => updateFormData('expenses', 'snowRemoval', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Extermination</label><MoneyInput value={formData.extermination} onChange={(value) => updateFormData('expenses', 'extermination', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Other</label><MoneyInput value={formData.otherHouseholdMaintenance} onChange={(value) => updateFormData('expenses', 'otherHouseholdMaintenance', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: HOUSEHOLD MAINTENANCE</span>
              <span className="font-bold text-orange-900">${householdMaintenanceTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Household Help */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(h) Household Help: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Domestic (housekeeper, etc.)</label><MoneyInput value={formData.domestic} onChange={(value) => updateFormData('expenses', 'domestic', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Nanny/Au Pair/Child Care</label><MoneyInput value={formData.nannyAuPair} onChange={(value) => updateFormData('expenses', 'nannyAuPair', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Babysitter</label><MoneyInput value={formData.babysitter} onChange={(value) => updateFormData('expenses', 'babysitter', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Other</label><MoneyInput value={formData.otherHouseholdHelp} onChange={(value) => updateFormData('expenses', 'otherHouseholdHelp', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: HOUSEHOLD HELP</span>
              <span className="font-bold text-orange-900">${householdHelpTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Automobile */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(i) Automobile: Monthly (List data for each car separately)</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year:</label>
              <input
                type="text"
                value={formData.carYear || ''}
                onChange={(e) => updateFormData('expenses', 'carYear', e.target.value)}
                placeholder="Year"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make:</label>
              <input
                type="text"
                value={formData.carMake || ''}
                onChange={(e) => updateFormData('expenses', 'carMake', e.target.value)}
                placeholder="Make"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personal:</label>
              <input
                type="text"
                value={formData.carPersonal || ''}
                onChange={(e) => updateFormData('expenses', 'carPersonal', e.target.value)}
                placeholder="Personal use %"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business:</label>
              <input
                type="text"
                value={formData.carBusiness || ''}
                onChange={(e) => updateFormData('expenses', 'carBusiness', e.target.value)}
                placeholder="Business use %"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Lease or Loan Payments (indicate lease term)</label><MoneyInput value={formData.leaseLoanPayments} onChange={(value) => updateFormData('expenses', 'leaseLoanPayments', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Gas and Oil</label><MoneyInput value={formData.gasAndOil} onChange={(value) => updateFormData('expenses', 'gasAndOil', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Repairs</label><MoneyInput value={formData.repairs} onChange={(value) => updateFormData('expenses', 'repairs', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Car Wash</label><MoneyInput value={formData.carWash} onChange={(value) => updateFormData('expenses', 'carWash', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Parking and tolls</label><MoneyInput value={formData.parkingTolls} onChange={(value) => updateFormData('expenses', 'parkingTolls', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Other</label><MoneyInput value={formData.otherAutomobile} onChange={(value) => updateFormData('expenses', 'otherAutomobile', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: AUTOMOTIVE</span>
              <span className="font-bold text-orange-900">${automobileTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Education Costs */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(j) Education Costs: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Nursery and Pre-school</label><MoneyInput value={formData.nurseryPreschool} onChange={(value) => updateFormData('expenses', 'nurseryPreschool', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Primary and Secondary</label><MoneyInput value={formData.primarySecondary} onChange={(value) => updateFormData('expenses', 'primarySecondary', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. College</label><MoneyInput value={formData.college} onChange={(value) => updateFormData('expenses', 'college', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Post-Graduate</label><MoneyInput value={formData.postGraduate} onChange={(value) => updateFormData('expenses', 'postGraduate', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Religious Instruction</label><MoneyInput value={formData.religiousInstruction} onChange={(value) => updateFormData('expenses', 'religiousInstruction', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. School Transportation</label><MoneyInput value={formData.schoolTransportation} onChange={(value) => updateFormData('expenses', 'schoolTransportation', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. School Supplies/Books</label><MoneyInput value={formData.schoolSuppliesBooks} onChange={(value) => updateFormData('expenses', 'schoolSuppliesBooks', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">8. School Lunches</label><MoneyInput value={formData.schoolLunches} onChange={(value) => updateFormData('expenses', 'schoolLunches', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">9. Tutoring</label><MoneyInput value={formData.tutoring} onChange={(value) => updateFormData('expenses', 'tutoring', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">10. School Events</label><MoneyInput value={formData.schoolEvents} onChange={(value) => updateFormData('expenses', 'schoolEvents', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">11. Child(ren)'s extra-curricular and educational enrichment activities</label><MoneyInput value={formData.extracurricularActivities} onChange={(value) => updateFormData('expenses', 'extracurricularActivities', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">12. Other</label><MoneyInput value={formData.otherEducation} onChange={(value) => updateFormData('expenses', 'otherEducation', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: EDUCATION</span>
              <span className="font-bold text-orange-900">${educationTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Recreational */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(k) Recreational: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Vacations</label><MoneyInput value={formData.vacations} onChange={(value) => updateFormData('expenses', 'vacations', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Movies, Theatre, Ballet, Etc.</label><MoneyInput value={formData.moviesTheatre} onChange={(value) => updateFormData('expenses', 'moviesTheatre', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Music (Digital or Physical Media)</label><MoneyInput value={formData.music} onChange={(value) => updateFormData('expenses', 'music', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Recreation Clubs and Memberships</label><MoneyInput value={formData.recreationClubs} onChange={(value) => updateFormData('expenses', 'recreationClubs', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Activities for yourself</label><MoneyInput value={formData.activitiesYourself} onChange={(value) => updateFormData('expenses', 'activitiesYourself', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Health Club</label><MoneyInput value={formData.healthClub} onChange={(value) => updateFormData('expenses', 'healthClub', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. Summer Camp</label><MoneyInput value={formData.summerCamp} onChange={(value) => updateFormData('expenses', 'summerCamp', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">8. Birthday party costs for your child(ren)</label><MoneyInput value={formData.birthdayParties} onChange={(value) => updateFormData('expenses', 'birthdayParties', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">9. Other</label><MoneyInput value={formData.otherRecreational} onChange={(value) => updateFormData('expenses', 'otherRecreational', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: RECREATIONAL</span>
              <span className="font-bold text-orange-900">${recreationalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Income Taxes */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(l) Income Taxes: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Federal</label><MoneyInput value={formData.federalTaxes} onChange={(value) => updateFormData('expenses', 'federalTaxes', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. State</label><MoneyInput value={formData.stateTaxes} onChange={(value) => updateFormData('expenses', 'stateTaxes', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. City</label><MoneyInput value={formData.cityTaxes} onChange={(value) => updateFormData('expenses', 'cityTaxes', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Social Security and Medicare</label><MoneyInput value={formData.socialSecurityMedicare} onChange={(value) => updateFormData('expenses', 'socialSecurityMedicare', value)} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">5. Number of dependents claimed in prior tax year</label>
              <input
                type="number"
                value={formData.numberOfDependents || ''}
                onChange={(e) => updateFormData('expenses', 'numberOfDependents', e.target.value)}
                placeholder="Number of dependents"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">6. List any refund received by you for prior tax year</label>
              <MoneyInput value={formData.taxRefund} onChange={(value) => updateFormData('expenses', 'taxRefund', value)} />
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: INCOME TAXES</span>
              <span className="font-bold text-orange-900">${incomeTaxesTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Miscellaneous */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(m) Miscellaneous: Monthly</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">1. Beauty parlor/Barber/Spa</label><MoneyInput value={formData.beautyBarberSpa} onChange={(value) => updateFormData('expenses', 'beautyBarberSpa', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">2. Toiletries/Non-Prescription Drugs</label><MoneyInput value={formData.toiletriesNonPrescription} onChange={(value) => updateFormData('expenses', 'toiletriesNonPrescription', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">3. Books, magazines, newspapers</label><MoneyInput value={formData.booksMagazinesNewspapers} onChange={(value) => updateFormData('expenses', 'booksMagazinesNewspapers', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">4. Gifts to others</label><MoneyInput value={formData.giftsToOthers} onChange={(value) => updateFormData('expenses', 'giftsToOthers', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">5. Charitable contributions</label><MoneyInput value={formData.charitableContributions} onChange={(value) => updateFormData('expenses', 'charitableContributions', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">6. Religious organizations dues</label><MoneyInput value={formData.religiousOrganizationDues} onChange={(value) => updateFormData('expenses', 'religiousOrganizationDues', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">7. Union and organization dues</label><MoneyInput value={formData.unionOrganizationDues} onChange={(value) => updateFormData('expenses', 'unionOrganizationDues', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">8. Commutation expenses</label><MoneyInput value={formData.commutationExpenses} onChange={(value) => updateFormData('expenses', 'commutationExpenses', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">9. Veterinarian/pet expenses</label><MoneyInput value={formData.veterinarianPetExpenses} onChange={(value) => updateFormData('expenses', 'veterinarianPetExpenses', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">10. Child support payments (for Child(ren) of a prior marriage or relationship)</label><MoneyInput value={formData.childSupportPayments} onChange={(value) => updateFormData('expenses', 'childSupportPayments', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">11. Alimony and maintenance payments (prior marriage)</label><MoneyInput value={formData.alimonyMaintenancePayments} onChange={(value) => updateFormData('expenses', 'alimonyMaintenancePayments', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">12. Loan payments</label><MoneyInput value={formData.loanPayments} onChange={(value) => updateFormData('expenses', 'loanPayments', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">13. Unreimbursed business expenses</label><MoneyInput value={formData.unreimbursedBusinessExpenses} onChange={(value) => updateFormData('expenses', 'unreimbursedBusinessExpenses', value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">14. Safe Deposit Box rental fee</label><MoneyInput value={formData.safeDepositBoxRental} onChange={(value) => updateFormData('expenses', 'safeDepositBoxRental', value)} /></div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: MISCELLANEOUS</span>
              <span className="font-bold text-orange-900">${miscellaneousTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Other */}
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-md font-medium text-gray-900">(n) Other: Monthly</h3>
          <p className="text-sm text-gray-600 mb-4">List any other monthly expenses not covered in the above categories</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense 1</label>
              <MoneyInput value={formData.otherExpense1} onChange={(value) => updateFormData('expenses', 'otherExpense1', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense 2</label>
              <MoneyInput value={formData.otherExpense2} onChange={(value) => updateFormData('expenses', 'otherExpense2', value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense 3</label>
              <MoneyInput value={formData.otherExpense3} onChange={(value) => updateFormData('expenses', 'otherExpense3', value)} />
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="font-medium text-orange-900">TOTAL: OTHER</span>
              <span className="font-bold text-orange-900">${otherTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Monthly Expenses */}
        <div className="border-t pt-6">
          <div className="bg-orange-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-orange-900">TOTAL: MONTHLY EXPENSES</span>
              <span className="text-xl font-bold text-orange-900">${totalMonthlyExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteExpensesForm;