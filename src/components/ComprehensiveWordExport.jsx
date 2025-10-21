import React, { useState } from "react";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  PageNumber,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

const ComprehensiveWordExport = ({ formData, userRole = "plaintiff", currentUser }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // ---------- Helpers ----------
  const num = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return isFinite(v) ? v : 0;
    const cleaned = String(v).replace(/[^0-9.-]/g, "");
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  };
  const money = (v) =>
    `$${num(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const safeText = (v, fallback = "________________") => {
    if (v === null || v === undefined) return fallback;
    if (typeof v === "string" && v.trim() === "") return fallback;
    return String(v);
  };

  // Get county from familyData and format it properly
  const getCountyDisplay = () => {
    // Try multiple possible county field locations
    const county = formData.familyData?.county || 
                   formData.familyData?.oathCounty || 
                   formData.county || 
                   '';
    
    if (!county) return '________'; // Show blank if no county found
    
    // Special case for New York county - be more flexible with matching
    const countyLower = county.toLowerCase();
    if (countyLower.includes('new york') || 
        countyLower.includes('manhattan') || 
        county === 'New York (Manhattan)') {
      return 'NEW YORK';
    }
    
    return county.toUpperCase();
  };

  // get value from flat or nested shapes (e.g., expenses.housing.mortgageCoopLoan OR expenses.mortgageCoopLoan)
  const pick = (root, ...paths) => {
    for (const path of paths) {
      const parts = path.split(".");
      let cur = root;
      let ok = true;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
        else {
          ok = false;
          break;
        }
      }
      if (ok && cur !== undefined) return cur;
    }
    return undefined;
  };

  // Paragraph factory (Times New Roman default)
  const P = (text, opts = {}) =>
    new Paragraph({
      alignment: opts.align,
      spacing: opts.spacing || { after: 120 },
      children: [
        new TextRun({
          text: text ?? "",
          bold: !!opts.bold,
          italics: !!opts.italics,
          size: opts.size ?? 20, // 10pt
          font: "Times New Roman",
        }),
      ],
      pageBreakBefore: !!opts.pageBreakBefore,
    });

  const cell = (children, opts = {}) =>
    new TableCell({
      width: opts.width,
      margins: { top: 120, bottom: 120, left: 120, right: 120 },
      borders: opts.borders,
      shading: opts.shading,
      children: Array.isArray(children) ? children : [children],
    });

  const grid = (rows, opts = {}) => {
    // Validate rows is a proper array
    if (!Array.isArray(rows) || rows.length === 0) {
      console.error("Invalid rows array passed to grid:", rows);
      throw new Error("grid() requires a non-empty array of rows");
    }
    
    const tableOptions = {
      width: { size: opts.widthPct ?? 100, type: WidthType.PERCENTAGE },
      borders: opts.borders ?? {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        insideH: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
        insideV: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
      },
      rows,
    };
    
    return new Table(tableOptions);
  };

  const row = (texts = [], { isHeader = false, colWidths } = {}) =>
    new TableRow({
      cantSplit: true,
      children: texts.map((t, i) => {
        const cellOpts = {
          shading: isHeader ? { fill: "F4F4F4" } : undefined,
        };
        
        // Only add width if colWidths exists and the value is valid
        if (colWidths && colWidths[i] && typeof colWidths[i] === 'number' && colWidths[i] > 0 && isFinite(colWidths[i])) {
          cellOpts.width = { size: colWidths[i], type: WidthType.DXA };
        }
        
        return cell(P(String(t ?? "")), cellOpts);
      }),
    });

  const totalRow = (label, val, { colWidths } = {}) => {
    const cell1Opts = { shading: { fill: "F4F4F4" } };
    const cell2Opts = { shading: { fill: "F4F4F4" } };
    
    // Only add width if colWidths exists and values are valid
    if (colWidths && Array.isArray(colWidths)) {
      if (colWidths[0] && typeof colWidths[0] === 'number' && colWidths[0] > 0 && isFinite(colWidths[0])) {
        cell1Opts.width = { size: colWidths[0], type: WidthType.DXA };
      }
      if (colWidths[1] && typeof colWidths[1] === 'number' && colWidths[1] > 0 && isFinite(colWidths[1])) {
        cell2Opts.width = { size: colWidths[1], type: WidthType.DXA };
      }
    }
    
    return new TableRow({
      children: [
        cell(
          new Paragraph({
            children: [
              new TextRun({ text: label, bold: true, size: 20, font: "Times New Roman" }),
            ],
          }),
          cell1Opts
        ),
        cell(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: money(val), bold: true, size: 20, font: "Times New Roman" })],
          }),
          cell2Opts
        ),
      ],
    });
  };

  // ----- replace the entire captionBlock function -----
  const captionBlock = (caseInfo, plaintiffName, defendantName) => {
    // page width with 1" margins = 6.5" = 6.5 * 1440 = 9360 DXA
    const COLS = [5200, 1200, 2960]; // = 9360 exactly

    const makeCell = (children, opts = {}) => {
      const cellOptions = {
        children: Array.isArray(children) ? children : [children],
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      };
      
      // Add width if specified and valid
      if (opts.width && typeof opts.width === 'number' && opts.width > 0 && isFinite(opts.width)) {
        cellOptions.width = { size: opts.width, type: WidthType.DXA };
      }
      
      return new TableCell(cellOptions);
    };

    const TR = (...cells) => new TableRow({ children: cells });

    const L = (t, { bold = false, size = 20, align } = {}) =>
      new Paragraph({
        alignment: align,
        spacing: { after: 80 },
        children: [new TextRun({ text: t, bold, size, font: "Times New Roman" })],
      });

    return [
      // Court and County lines - both as regular text, left-aligned
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: "SUPREME COURT OF THE STATE OF NEW YORK",
            size: 22,
            font: "Times New Roman",
            bold: false,
            color: "000000",
          }),
        ],
      }),
      P(`COUNTY OF ${getCountyDisplay()}`, { bold: false, size: 22, align: AlignmentType.LEFT }),
      P("---------------------------------------------------------------------X", { size: 20 }),

      // SIMPLIFIED - NO TABLE, just paragraphs
      P(`${plaintiffName || "___________________"}, Plaintiff`, { size: 20 }),
      P("STATEMENT OF NET WORTH", { bold: true, size: 20, align: AlignmentType.RIGHT }),
      P("DATED: __________", { bold: true, size: 20, align: AlignmentType.RIGHT }),
      P("", { size: 20 }),
      P("- against -", { align: AlignmentType.CENTER, size: 20 }),
      P("", { size: 20 }),
      P(`${defendantName || "___________________"}, Defendant.`, { size: 20 }),
      P(`Index No. ${safeText(caseInfo?.indexNo || "_______")}`, { size: 20, align: AlignmentType.RIGHT }),
      P(`Date Action Commenced: ${safeText(caseInfo?.dateCommenced || "_______")}`, { size: 20, align: AlignmentType.RIGHT }),

      P("----------------------------------------------------------------------X", {
        size: 20,
        align: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
      }),

      // Instruction + oath block header lines
      P('Complete all items, marking "NONE", "INAPPLICABLE" and "UNKNOWN", if appropriate', { italics: true }),
      P("STATE OF NEW YORK\t)", {}),
      P(")ss.:", {}),
      P(`COUNTY OF ${getCountyDisplay()}\t)`, {}),
    ];
  };

  // Expense category table builder (tolerates nested/flat keys)
  const expenseCategory = (title, pairs) => {
    const items = pairs.map(([label, ...keys]) => {
      const val = keys
        .map((k) => pick(formData.expenses || {}, k))
        .find((v) => v !== undefined);
      return [label, money(val)];
    });

    const subtotal = pairs
      .map(([_, ...keys]) => {
        const val = keys.map((k) => pick(formData.expenses || {}, k)).find((v) => v !== undefined);
        return num(val);
      })
      .reduce((a, b) => a + b, 0);

    const colWidths = [8000, 2000];
    const rows = [
      row([`${title}`, "Monthly"], { isHeader: true, colWidths }),
      ...items.map(([l, v]) => {
        const leftCellOpts = {};
        const rightCellOpts = {};
        
        if (typeof colWidths[0] === 'number' && colWidths[0] > 0 && isFinite(colWidths[0])) {
          leftCellOpts.width = { size: colWidths[0], type: WidthType.DXA };
        }
        if (typeof colWidths[1] === 'number' && colWidths[1] > 0 && isFinite(colWidths[1])) {
          rightCellOpts.width = { size: colWidths[1], type: WidthType.DXA };
        }
        
        return new TableRow({
          children: [
            cell(P(l), leftCellOpts),
            cell(
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: v, size: 20, font: "Times New Roman" })],
              }),
              rightCellOpts
            ),
          ],
        });
      }),
      totalRow(`TOTAL: ${title.toUpperCase()}`, subtotal, { colWidths }),
    ];

    return { table: grid(rows, {}), total: subtotal }; // columnWidths removed - causes errors
  };

  // Header/Footer
  const makeHeader = () =>
    new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "",
              font: "Times New Roman",
              size: 22,
              bold: false,
            }),
          ],
        }),
      ],
    });

  const makeFooter = () =>
    new Footer({
      children: [
            new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text: "[UCS Rev.1/1/24]", size: 16, font: "Times New Roman" })],
        }),
            new Paragraph({
          alignment: AlignmentType.RIGHT,
              children: [
            new TextRun({ text: "Page ", size: 16, font: "Times New Roman" }),
            PageNumber.CURRENT,
            new TextRun({ text: " of ", size: 16, font: "Times New Roman" }),
            PageNumber.TOTAL_PAGES,
          ],
        }),
      ],
    });

  // ---------- Export ----------
  const exportToWord = async () => {
    setIsExporting(true);
    console.log("Starting Word export...");
    try {
      // --------- Data shorthands ----------
      console.log("Extracting form data...");
      const caseInfo = formData.case || {};
      const fd = formData.familyData || {};
      const inc = formData.income || {};
      const assets = formData.assets || {};
      const liab = formData.liabilities || {};
      const addl = formData.additionalSections || {};
      console.log("Form data extracted successfully");


      // ---------- FAMILY DATA ----------
      const familyBlock = [
        P("I. FAMILY DATA", { bold: true, size: 24, spacing: { after: 240 } }),
        grid(
          [
            row([`(a) Plaintiff’s date of birth:`, safeText(fd.plaintiffDateOfBirth || "")]),
            row([`(b) Defendant’s date of birth:`, safeText(fd.defendantDateOfBirth || "")]),
            row([`(c) Date married:`, safeText(fd.dateMarried || "")]),
          ],
          {}
        ),
        P(""),
        grid([row([`(d) Names and dates of birth of Child(ren) of the marriage:`, ""])]),
        ...(Array.isArray(fd.children) && fd.children.length
          ? fd.children.filter(c => c && typeof c === 'object').map((c, i) =>
              P(`• Child ${i + 1}: ${safeText(c?.name || "")} — DOB: ${safeText(c?.dateOfBirth || "")}`)
            )
          : [P("(use rider for additional child(ren))")]),
        P(""),
        grid(
          [
            row([`(e) Minor child(ren) of prior marriage:`, safeText(fd.minorChildrenPriorMarriage || "")]),
            row([`(f) Custody of child(ren) of prior marriage:`, safeText(fd.custodyPriorMarriage || "")]),
            row([`(g) Plaintiff’s present address:`, safeText(fd.plaintiffAddress || "")]),
            row([`Defendant’s present address:`, safeText(fd.defendantAddress || "")]),
            row([`(h) Occupation/Employer of Plaintiff:`, safeText(fd.plaintiffOccupation || "")]),
            row([`Occupation/Employer of Defendant:`, safeText(fd.defendantOccupation || "")]),
          ],
          {}
        ),
      ];

      // ---------- EXPENSES ----------
      const expensesIntro = [
        P("II. EXPENSES", { bold: true, size: 24, pageBreakBefore: true }),
        P(
          'List your current expenses on a monthly basis. If there has been any change in these expenses during the recent past please indicate. Items included under "other" should be listed separately with separate dollar amounts.',
          { italics: true }
        ),
      ];

      const housing = expenseCategory("Housing", [
        ["1. Mortgage/Co-op Loan", "housing.mortgageCoopLoan", "mortgageCoopLoan"],
        ["2. Home Equity Line of Credit/Second Mortgage", "housing.homeEquityLine", "homeEquityLine"],
        ["3. Real Estate Taxes (if not included in mortgage payment)", "housing.realEstateTaxes", "realEstateTaxes"],
        ["4. Homeowners/Renter’s Insurance", "housing.homeownersInsurance", "homeownersRentersInsurance"],
        ["5. HOA/Maintenance/Condo Charges", "housing.maintenanceCharges", "homeownersAssociation"],
        ["6. Rent", "housing.rent", "rent"],
        ["7. Other", "housing.other", "housingOther"],
      ]);

      const utilities = expenseCategory("Utilities", [
        ["1. Fuel Oil/Gas", "utilities.fuelOilGas", "fuelOilGas"],
        ["2. Electric", "utilities.electric", "electric"],
        ["3. Telephone (land line)", "utilities.telephoneLandline", "landlinePhone"],
        ["4. Mobile Phone", "utilities.mobilePhone", "mobilePhone"],
        ["5. Cable/Satellite TV", "utilities.cableSatellite", "cableSatellite"],
        ["6. Internet", "utilities.internet", "internet"],
        ["7. Alarm", "utilities.alarm", "alarm"],
        ["8. Water", "utilities.water", "water"],
        ["9. Other", "utilities.other", "utilitiesOther"],
      ]);

      const food = expenseCategory("Food", [
        ["1. Groceries", "food.groceries", "groceries"],
        ["2. Dining Out/Take Out", "food.diningOut", "diningOutTakeout"],
        ["3. Other", "food.other", "foodOther"],
      ]);

      const clothing = expenseCategory("Clothing", [
        ["1. Yourself", "clothing.yourself", "clothingYourself"],
        ["2. Child(ren)", "clothing.children", "clothingChildren"],
        ["3. Dry Cleaning", "clothing.dryCleaning", "dryCleaning"],
        ["4. Other", "clothing.other", "otherClothing"],
      ]);

      const insurance = expenseCategory("Insurance", [
        ["1. Life", "insurance.life", "lifeInsurance"],
        ["2. Fire/Theft/Liability (personal articles policy)", "insurance.fireTheftLiability", "fireTheftLiabilityInsurance"],
        ["3. Automotive", "insurance.automotive", "automotiveInsurance"],
        ["4. Umbrella Policy", "insurance.umbrellaPolicy", "umbrellaPolicy"],
        ["5. Medical Plan", "insurance.medicalPlan", "medicalPlan"],
        ["6. Dental Plan", "insurance.dentalPlan", "dentalPlan"],
        ["7. Optical Plan", "insurance.opticalPlan", "opticalPlan"],
        ["8. Disability", "insurance.disability", "disabilityInsurance"],
        ["9. Worker’s Compensation", "insurance.workersCompensation", "workersComp"],
        ["10. Long Term Care Insurance", "insurance.longTermCare", "longTermCare"],
        ["11. Other", "insurance.other", "insuranceOther"],
      ]);

      const unreimbursed = expenseCategory("Unreimbursed Medical", [
        ["1. Medical", "unreimbursedMedical.medical", "medical"],
        ["2. Dental", "unreimbursedMedical.dental", "dental"],
        ["3. Optical", "unreimbursedMedical.optical", "optical"],
        ["4. Pharmaceutical", "unreimbursedMedical.pharmaceutical", "pharmaceutical"],
        ["5. Surgical/Nursing/Hospital", "unreimbursedMedical.surgicalNursingHospital", "surgicalNursingHospital"],
        ["6. Psychotherapy", "unreimbursedMedical.psychotherapy", "psychotherapy"],
        ["7. Other", "unreimbursedMedical.other", "unreimbursedMedicalOther"],
      ]);

      const household = expenseCategory("Household Maintenance", [
        ["1. Repairs/Maintenance", "household.repairs", "repairsMaintenance"],
        ["2. Gardening/Landscaping", "household.gardening", "gardeningLandscaping"],
        ["3. Sanitation/Carting", "household.sanitation", "sanitationCarting"],
        ["4. Snow Removal", "household.snowRemoval", "snowRemoval"],
        ["5. Extermination", "household.extermination", "extermination"],
        ["6. Other", "household.other", "householdMaintenanceOther"],
      ]);

      const householdHelp = expenseCategory("Household Help", [
        ["1. Domestic (housekeeper, etc.)", "householdHelp.domestic", "domestic"],
        ["2. Nanny/Au Pair/Child Care", "householdHelp.nanny", "nannyAuPairChildCare"],
        ["3. Babysitter", "householdHelp.babysitter", "babysitter"],
        ["4. Other", "householdHelp.other", "householdHelpOther"],
      ]);

      const auto = expenseCategory("Automobile", [
        ["1. Lease or Loan Payments", "transportation.leaseLoan", "leaseLoanPayments"],
        ["2. Gas and Oil", "transportation.gasoline", "gasOil"],
        ["3. Repairs", "transportation.vehicleMaintenance", "repairs"],
        ["4. Car Wash", "transportation.carWash", "carWash"],
        ["5. Parking and tolls", "transportation.parking", "parkingTolls"],
        ["6. Other", "transportation.other", "otherAutomobile"],
      ]);

      const education = expenseCategory("Education Costs", [
        ["1. Nursery and Pre-school", "education.nursery", "nurseryPreschool"],
        ["2. Primary and Secondary", "education.primarySecondary", "primarySecondary"],
        ["3. College", "education.college", "college"],
        ["4. Post-Graduate", "education.postGraduate", "postGraduate"],
        ["5. Religious Instruction", "education.religiousInstruction", "religiousInstruction"],
        ["6. School Transportation", "education.schoolTransport", "schoolTransportation"],
        ["7. School Supplies/Books", "education.schoolSupplies", "schoolSuppliesBooks"],
        ["8. School Lunches", "education.schoolLunches", "schoolLunches"],
        ["9. Tutoring", "education.tutoring", "tutoring"],
        ["10. School Events", "education.schoolEvents", "schoolEvents"],
        ["11. Extra-curricular/Enrichment", "education.extracurricular", "extraCurricularActivities"],
        ["12. Other", "education.other", "otherEducation"],
      ]);

      const recreation = expenseCategory("Recreational", [
        ["1. Vacations", "recreation.vacations", "vacations"],
        ["2. Movies, Theatre, Ballet, Etc.", "recreation.moviesTheater", "moviesTheatreBallet"],
        ["3. Music (Digital/Physical)", "recreation.music", "music"],
        ["4. Recreation Clubs/Memberships", "recreation.sportsRecreation", "recreationClubsMemberships"],
        ["5. Activities for yourself", "recreation.activitiesSelf", "activitiesYourself"],
        ["6. Health Club", "recreation.healthClub", "healthClub"],
        ["7. Summer Camp", "recreation.summerCamp", "summerCamp"],
        ["8. Birthday party costs (child[ren])", "recreation.birthdayCosts", "birthdayPartyCosts"],
        ["9. Other", "recreation.other", "otherRecreational"],
      ]);

      // Income taxes: do NOT sum dependents/refund prompts into money total
      const incomeTaxes = expenseCategory("Income Taxes", [
        ["1. Federal", "incomeTaxes.federal", "federal"],
        ["2. State", "incomeTaxes.state", "state"],
        ["3. City", "incomeTaxes.local", "city"],
        ["4. Social Security and Medicare", "incomeTaxes.ficaMedicare", "socialSecurityMedicare"],
      ]);

      const misc = expenseCategory("Miscellaneous", [
        ["1. Beauty parlor/Barber/Spa", "miscellaneous.beauty", "beautyParlorBarberSpa"],
        ["2. Toiletries/Non-Prescription Drugs", "miscellaneous.toiletries", "toiletriesNonPrescription"],
        ["3. Books, magazines, newspapers", "miscellaneous.books", "booksMagazinesNewspapers"],
        ["4. Gifts to others", "miscellaneous.gifts", "giftsToOthers"],
        ["5. Charitable contributions", "miscellaneous.charity", "charitableContributions"],
        ["6. Religious organizations dues", "miscellaneous.religiousDues", "religiousOrganizationsDues"],
        ["7. Union/organization dues", "miscellaneous.unionDues", "unionOrganizationDues"],
        ["8. Commutation expenses", "miscellaneous.commute", "commutationExpenses"],
        ["9. Veterinarian/pet expenses", "miscellaneous.pets", "veterinarianPetExpenses"],
        ["10. Child support payments (prior marriage/relationship)", "miscellaneous.childSupportPrior", "childSupportPayments"],
        ["11. Alimony/maintenance (prior marriage)", "miscellaneous.alimonyPrior", "alimonyMaintenancePayments"],
        ["12. Loan payments", "miscellaneous.loanPayments", "loanPayments"],
        ["13. Unreimbursed business expenses", "miscellaneous.businessExpenses", "unreimbursedBusinessExpenses"],
        ["14. Safe Deposit Box rental fee", "miscellaneous.safeDeposit", "safeDepositBoxRental"],
      ]);

      const otherMonthly = expenseCategory("Other", [
        ["1.", "otherMonthly.one", "otherExpense1"],
        ["2.", "otherMonthly.two", "otherExpense2"],
        ["3.", "otherMonthly.three", "otherExpense3"],
      ]);

      const totalMonthlyExpenses =
        housing.total +
        utilities.total +
        food.total +
        clothing.total +
        insurance.total +
        unreimbursed.total +
        household.total +
        householdHelp.total +
        auto.total +
        education.total +
        recreation.total +
        incomeTaxes.total + // excludes dependents/refund prompts
        misc.total +
        otherMonthly.total;

      const totalExpensesTable = grid(
        [totalRow("TOTAL: MONTHLY EXPENSES", totalMonthlyExpenses, { colWidths: [8000, 2000] })],
        {}
      );

      // ---------- INCOME ----------
      const maintenanceReceived = (() => {
        const entries = inc.maintenanceReceivedEntries || [];
        return Array.isArray(entries) ? entries.reduce((s, r) => {
          if (!r || typeof r !== 'object') return s;
          return s + num(r.amount);
        }, 0) : 0;
      })();
      
      const householdIncome = (() => {
        const entries = inc.householdIncomeEntries || [];
        return Array.isArray(entries) ? entries.reduce((s, r) => {
          if (!r || typeof r !== 'object') return s;
          return s + num(r.annualIncome);
        }, 0) : 0;
      })();

      const incomeBlock = [
        P("III. GROSS INCOME INFORMATION:", { bold: true, size: 24, pageBreakBefore: true }),
        grid(
          [
            row([
              "(a) Gross (total) income — most recent Federal return",
              money(inc.grossAnnualIncome || inc.grossIncome),
            ]),
            row([
              "List any amount deducted from gross income for retirement benefits or tax deferred savings",
              money(inc.retirementDeductions),
            ]),
          ],
          {}
        ),
        P(""),
        P("(b) To the extent not already included in (a):", {}),
        grid(
          [
            row(["1. Investment income", money(inc.investmentIncome)]),
            row(["2. Worker’s compensation", money(inc.workersCompensation)]),
            row(["3. Disability benefits", money(inc.disabilityBenefits)]),
            row(["4. Unemployment insurance benefits", money(inc.unemploymentBenefits || inc.unemploymentInsurance)]),
            row(["5. Social Security benefits", money(inc.socialSecurityBenefits)]),
            row(["6. Supplemental Security Income", money(inc.supplementalSecurityIncome)]),
            row(["7. Public assistance", money(inc.publicAssistance)]),
            row(["8. Food stamps", money(inc.foodStamps)]),
            row(["9. Veterans benefits", money(inc.veteransBenefits)]),
            row(["10. Pensions and retirement benefits", money(inc.pensionsRetirement || inc.pensionsRetirementBenefits)]),
            row(["11. Fellowships and stipends", money(inc.fellowshipsStipends)]),
            row(["12. Annuity payments", money(inc.annuityPayments)]),
          ],
          {}
        ),
        P(""),
        grid(
          [
            row([
              "(c) Household member income (name / annual income)",
              (inc.householdIncomeEntries || [])
                .map((m) => `${safeText(m?.name)} — ${money(m?.annualIncome)}`)
                .join("; "),
            ]),
            row(["(d) Maintenance/Child Support received", money(maintenanceReceived)]),
            row(["(e) Other", money(inc.otherIncome)]),
          ],
          {}
        ),
      ];

      const grossIncomeTotal =
        num(inc.grossAnnualIncome || inc.grossIncome) +
        num(inc.retirementDeductions) +
        num(inc.investmentIncome) +
        num(inc.workersCompensation) +
        num(inc.disabilityBenefits) +
        num(inc.unemploymentBenefits || inc.unemploymentInsurance) +
        num(inc.socialSecurityBenefits) +
        num(inc.supplementalSecurityIncome) +
        num(inc.publicAssistance) +
        num(inc.foodStamps) +
        num(inc.veteransBenefits) +
        num(inc.pensionsRetirement || inc.pensionsRetirementBenefits) +
        num(inc.fellowshipsStipends) +
        num(inc.annuityPayments) +
        num(maintenanceReceived) +
        num(inc.otherIncome) +
        num(householdIncome);

      const totalIncomeTable = grid(
        [totalRow("TOTAL: GROSS INCOME", grossIncomeTotal, { colWidths: [8000, 2000] })],
        {}
      );

      // ---------- ASSETS ----------
      // support arrays on either assets.* or formData.* root
      const arr = (key) => {
        const array = assets[key] || formData[key] || [];
        return Array.isArray(array) ? array : [];
      };
      const cashTotal = num(assets.cashAmount);
      const checkingTotal = num(assets.checkingAccount1Balance) + num(assets.checkingAccount2Balance);
      const savingsTotal = num(assets.savingsAccount1Balance) + num(assets.savingsAccount2Balance);
      const realEstateTotal = arr("realEstateEntries").reduce((s, it) => s + num(it.currentFairMarketValue), 0);
      const retirementTotal = arr("retirementEntries").reduce((s, it) => s + num(it.currentValue), 0);
      const vehicleTotal = arr("vehicleEntries").reduce((s, it) => s + num(it.currentFairMarketValue), 0);
      const jewelryArtTotal = arr("jewelryArtEntries").reduce((s, it) => s + num(it.estimateCurrentValue), 0);
      const businessTotal = arr("businessEntries").reduce((s, it) => s + num(it.netWorth), 0);
      const lifeInsTotal =
        arr("lifeInsuranceEntries").reduce((s, it) => s + num(it.currentCashSurrenderValue || it.currentCSV), 0);
      const investmentTotal = arr("investmentEntries").reduce((s, it) => s + num(it.currentValue), 0);
      const loanRecvTotal = arr("loanReceivableEntries").reduce((s, it) => s + num(it.currentAmountDue), 0);
      const contingentTotal = arr("contingentInterestEntries").reduce((s, it) => s + num(it.currentValue), 0);
      const otherAssetTotal = arr("otherAssetEntries").reduce((s, it) => s + num(it.currentValue), 0);

      const cashAccountsTotal = cashTotal + checkingTotal + savingsTotal;
      const totalAssets =
        cashAccountsTotal +
        realEstateTotal +
        retirementTotal +
        vehicleTotal +
        jewelryArtTotal +
        businessTotal +
        lifeInsTotal +
        investmentTotal +
        loanRecvTotal +
        contingentTotal +
        otherAssetTotal;

      const assetsBlock = [
        P("IV. ASSETS", { bold: true, size: 24, pageBreakBefore: true }),
        P(
          "(If any asset is held jointly with spouse or another, so state, and set forth your respective shares. Attach additional sheets, if needed)",
          { italics: true }
        ),
        grid(
          [
            row(["A.1. Cash Accounts", money(cashAccountsTotal)]),
            row(["B.4. Real Estate", money(realEstateTotal)]),
            row(["C.5. Retirement Accounts", money(retirementTotal)]),
            row(["D.6. Vehicles", money(vehicleTotal)]),
            row(["E.7. Jewelry/Art/Antiques/Household Furnishings", money(jewelryArtTotal)]),
            row(["F.8. Interest in any Business", money(businessTotal)]),
            row(["G.9. Cash Surrender Value of Life Insurance", money(lifeInsTotal)]),
            row(["H.10. Investment Accounts / Securities", money(investmentTotal)]),
            row(["I.11. Loans to Others / Accounts Receivable", money(loanRecvTotal)]),
            row(["J.12. Contingent Interests", money(contingentTotal)]),
            row(["K.13. Other Assets", money(otherAssetTotal)]),
            totalRow("TOTAL ASSETS", totalAssets, { colWidths: [8000, 2000] }),
          ],
          {}
        ),
      ];

      // ---------- LIABILITIES ----------
      const L = (key) => liab[key] || formData[key] || {};
      const sumArr = (list, field) => {
        if (!Array.isArray(list)) return 0;
        return list.reduce((s, it) => {
          if (!it || typeof it !== 'object') return s;
          return s + num(it[field]);
        }, 0);
      };

      const accountsPayableTotal = sumArr(L("accountsPayableEntries"), "currentDebt");
      const creditCardTotal = sumArr(L("creditCardEntries"), "currentDebt");
      const mortgageTotal = sumArr(L("mortgageEntries"), "currentDebt");
      const homeEquityTotal = sumArr(L("homeEquityEntries"), "currentDebt");
      const notesPayableTotal = sumArr(L("notesPayableEntries"), "currentDebt");
      const brokerMarginTotal = sumArr(L("brokerMarginEntries"), "currentDebt");
      const taxesPayableTotal = sumArr(L("taxesPayableEntries"), "amountOfTax");
      const lifeInsLoanTotal = sumArr(L("lifeInsuranceLoanEntries"), "currentDebt");
      const installmentAccountTotal = sumArr(L("installmentAccountEntries"), "currentDebt");
      const otherLiabilityTotal = sumArr(L("otherLiabilityEntries"), "currentDebt");

      const totalLiabilities =
        accountsPayableTotal +
        creditCardTotal +
        mortgageTotal +
        homeEquityTotal +
        notesPayableTotal +
        brokerMarginTotal +
        taxesPayableTotal +
        lifeInsLoanTotal +
        installmentAccountTotal +
        otherLiabilityTotal;

      const liabilitiesBlock = [
        P("V. LIABILITIES", { bold: true, size: 24, pageBreakBefore: true }),
        grid(
          [
            row(["A.1. Accounts Payable", money(accountsPayableTotal)]),
            row(["B.2. Credit Card Debt", money(creditCardTotal)]),
            row(["C.3. Mortgages Payable on Real Estate", money(mortgageTotal)]),
            row(["D.4. Home Equity and Other Lines of Credit", money(homeEquityTotal)]),
            row(["E.5. Notes Payable", money(notesPayableTotal)]),
            row(["F.6. Broker’s Margin Accounts", money(brokerMarginTotal)]),
            row(["G.7. Taxes Payable", money(taxesPayableTotal)]),
            row(["H.8. Loans on Life Insurance Policies", money(lifeInsLoanTotal)]),
            row(["I.9. Installment accounts payable", money(installmentAccountTotal)]),
            row(["J.10. Other Liabilities", money(otherLiabilityTotal)]),
            totalRow("TOTAL LIABILITIES", totalLiabilities, { colWidths: [8000, 2000] }),
          ],
          {}
        ),
        P(""),
        grid([totalRow("NET WORTH (Assets minus Liabilities)", totalAssets - totalLiabilities, { colWidths: [8000, 2000] })], {}),
      ];

      // ---------- VI. ASSETS TRANSFERRED ----------
      const transferred = (() => {
        const entries = addl.assetsTransferredEntries || formData.assetsTransferredEntries || [];
        return Array.isArray(entries) ? entries.filter((t) => t && t.description) : [];
      })();
      const transfersTable = grid(
        [
          row(
            ["Description of Property", "To Whom Transferred and Relationship", "Date of Transfer", "Value"],
            { isHeader: true }
          ),
          ...(transferred.length
            ? transferred.map((t) =>
                row([
                  safeText(t.description),
                  safeText(t.toWhomTransferred || t.transferee) +
                    (t.relationship ? ` (${t.relationship})` : ""),
                  safeText(t.dateOfTransfer || t.date),
                  money(t.value),
                ])
              )
            : [row(["NONE", "N/A", "N/A", "N/A"])]),
        ],
        {}
      );

      // ---------- VII. FEES & VIII. OTHER ----------
      const fees = (() => {
        const entries = addl.legalExpertFeesEntries || addl.legalFeesEntries || [];
        return Array.isArray(entries) ? entries.filter((f) => f && (f.name || f.amount)) : [];
      })();
      const feesBlock =
        fees.length === 0
          ? [P("No legal or expert fees reported.")]
          : fees.flatMap((f, i) => [
              P(`Entry ${i + 1}:`, { bold: true }),
              P(`Professional Name: ${safeText(f.professionalName)}`),
              P(`Type of Professional: ${safeText(f.professionalType || f.typeOfProfessional)}`),
              P(`Amount Paid: ${money(f.amountPaid)}`),
              P(`Date Paid: ${safeText(f.datePaid)}`),
              P(`Source of Funds: ${safeText(f.sourceOfFunds)}`),
              P(""),
            ]);

      // ---------- Affirmation ----------
      const affirmation = [
        P(
          "The foregoing statements and a rider consisting of _____ page(s) annexed hereto and made a part hereof, have been carefully read by the undersigned who states that they are true and correct and states same, under oath, subject to the penalties of perjury."
        ),
        P(""),
        grid(
          [
            row(["*Sworn to before me this", "This is the _______ Statement of Net Worth"]),
            row(["day of _____________, 20__", "I have filed in this proceeding."]),
            row(["________________________", ""]),
            row(["Notary Public", "Attorney Certification:"]),
            row(["", "____________________"]),
          ],
          { borders: { top: { style: BorderStyle.NONE } } }
        ),
        P(
          "* Despite amendment of CPLR 2106 to permit civil litigants to file affirmations instead of affidavits, this form should still be signed before a notary public to comply with DRL 236(B)(4) (Sworn Statement of Net Worth), which statute remains in effect.",
          { italics: true }
        ),
        P("REQUIRED ATTACHMENTS:", { bold: true }),
        P("• Retainer Agreement"),
        P("• Most recent W-2, 1099s, K1s and Income Tax Returns"),
      ];

      // ---------- Build Document ----------
      console.log("Creating caption block...");
      let captionContent;
      try {
        const plaintiffFullName = safeText(fd.plaintiffName || formData.plaintiffName || "");
        const defendantFullName = safeText(fd.defendantName || formData.defendantName || "");
        console.log("Names prepared:", { plaintiffFullName, defendantFullName });
        
        captionContent = captionBlock(caseInfo, plaintiffFullName, defendantFullName);
        console.log("Caption block created successfully");
      } catch (captionError) {
        console.error("Error creating caption block:", captionError);
        throw new Error(`Caption block error: ${captionError.message}`);
      }
      
      console.log("Building document structure...");
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: { font: "Times New Roman", size: 20 },
              paragraph: { spacing: { line: 276 } },
            },
          },
        },
        sections: [
          {
            headers: { default: makeHeader() },
            footers: { default: makeFooter() },
            properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } }, // 1" margins
            children: [
              ...captionContent,
              P(
                `${safeText(
                  fd.deponentName || "_______________________"
                )}, the Plaintiff/Defendant herein, being duly sworn, deposes and says that, subject to the penalties of perjury, the following is an accurate statement as of ________, __ , 20__, of my net worth (assets of whatsoever kind and nature and wherever situated minus liabilities), statement of income from all sources and statement of assets transferred of whatsoever kind and nature and wherever situated and statement of expenses:`,
                { spacing: { after: 240 } }
              ),

              // I. FAMILY
              ...familyBlock,

              // II. EXPENSES
              ...expensesIntro,
              housing.table,
              P(""),
              utilities.table,
              P(""),
              food.table,
              P(""),
              clothing.table,
              P(""),
              P("(e) Insurance: Monthly", { bold: true }),
              grid(
                [
                  row(["5A. Medical Plan for yourself (carrier & insured):", ""]),
                  row(["5B. Medical Plan for children (carrier & insured):", ""]),
                ],
                {}
              ),
              insurance.table,
              P(""),
              unreimbursed.table,
              P(""),
              household.table,
              P(""),
              householdHelp.table,
              P(""),
              P("(i) Automobile: Monthly (List data for each car separately)", { bold: true }),
              grid([row(["Year: _____   Make: _____   Personal: ____   Business: ____", ""])], {}),
              auto.table,
              P(""),
              education.table,
              P(""),
              recreation.table,
              P(""),
              P("(l) Income Taxes: Monthly", { bold: true }),
              grid(
                [
                  row(["5. Number of dependents claimed in prior tax year", ""]),
                  row(["6. List any refund received by you for prior tax year", ""]),
                ],
                {}
              ),
              incomeTaxes.table,
              P(""),
              misc.table,
              P(""),
              otherMonthly.table,
              P(""),
              totalExpensesTable,

              // III. INCOME
              ...incomeBlock,
              totalIncomeTable,

              // IV. ASSETS
              ...assetsBlock,

              // V. LIABILITIES
              ...liabilitiesBlock,

              // VI. ASSETS TRANSFERRED
              P("VI. ASSETS TRANSFERRED", { bold: true, size: 24, pageBreakBefore: true }),
              transfersTable,

              // VII. FEES
              P("VII. LEGAL & EXPERT FEES", { bold: true, size: 24 }),
              ...feesBlock,

              // VIII. OTHER
              P("VIII. OTHER FINANCIAL CIRCUMSTANCES", { bold: true, size: 24 }),
              P(
                safeText(addl.otherFinancialCircumstances || formData.otherFinancialCircumstances || "NONE"),
                { spacing: { after: 240 } }
              ),

              // Affirmation/Attachments
              ...affirmation,
            ],
          },
        ],
      });

      console.log("Document structure created, packing to blob...");
      const blob = await Packer.toBlob(doc);
      console.log("Document packed successfully, preparing download...");
      const fileName = `Statement_of_Net_Worth_${userRole}_${new Date()
        .toISOString()
        .slice(0, 10)}.docx`;
      console.log("Saving file:", fileName);
      saveAs(blob, fileName);
      console.log("Word export completed successfully!");
    } catch (err) {
      console.error("Word generation error:", err);
      console.error("Error stack:", err.stack);
      alert(`Error generating Word document: ${err.message}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Export Statement of Net Worth</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 mb-2">
          This will generate a complete Statement of Net Worth Word document in the official NYS court format.
        </p>
        <p className="text-sm text-blue-800">
          The Word document will match the official form layout with proper tables and formatting.
        </p>
      </div>
        <button
          onClick={exportToWord}
          disabled={isExporting}
        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 w-auto h-auto text-sm ${
          isExporting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isExporting ? "⏳ Generating Word..." : "📄 Export to Word"}
        </button>
    </div>
  );
};

export default ComprehensiveWordExport;
