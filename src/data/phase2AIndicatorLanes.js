export const laneIndicatorFilters = {
  ATO: {
    suspicious: [
      "First-seen device near loss event",
      "Password reset before money movement",
      "MFA sent to newly changed phone/email",
      "Device/IP inconsistent with customer history",
      "Profile change immediately before attempted funds movement",
      "New device, new IP, and new destination appear in one session",
      "Customer lockout follows credential reset or MFA destination change"
    ],
    normal: [
      "Known device",
      "Known location",
      "Consistent customer timeline",
      "Account relationship is long-standing",
      "Known device and normal market align with customer story",
      "Profile change confirmed through trusted channel"
    ]
  },
  FRAUD_CHARGEBACK: {
    suspicious: [
      "Card-present use after reported loss window",
      "Merchant authorization conflicts with customer possession timeline",
      "Disputed spend clusters after last valid card use",
      "Repeated similar prior claims"
    ],
    normal: [
      "Card reported promptly after loss",
      "Entry mode and location fit the customer timeline",
      "Consistent customer timeline"
    ]
  },
  NON_FRAUD_CHARGEBACK: {
    suspicious: [
      "Merchant support missing for final amount or refund promise",
      "Customer participated but billing terms remain unsupported",
      "Receipt, invoice, or policy evidence does not answer reason code"
    ],
    normal: [
      "Merchant refund terms are documented",
      "Customer statement, receipt, and authorization line up",
      "Complete documentation",
      "Consistent customer timeline"
    ]
  },
  FIRST_PARTY: {
    suspicious: [
      "Digital goods used after purchase from household or known device",
      "Prior similar claims repeat across same merchant category",
      "Customer story conflicts with delivery, redemption, or usage evidence",
      "Repeated similar prior claims"
    ],
    normal: [
      "No repeated pattern across merchants",
      "Usage evidence does not conflict with customer statement",
      "Consistent customer timeline"
    ]
  },
  PAYROLL: {
    suspicious: [
      "New beneficiary or payroll destination",
      "Bank account ownership mismatch",
      "Callback could not verify the requested change",
      "Direct deposit destination changed close to payroll release",
      "Requested destination is prepaid, fintech, or first seen today",
      "Trusted callback not completed before payroll action"
    ],
    normal: [
      "Verified callback completed",
      "Verified callback completed using trusted employee record",
      "Destination account has prior payroll history",
      "Destination account previously used"
    ]
  },
  BEC: {
    suspicious: [
      "Look-alike domain or reply-to mismatch",
      "New beneficiary or payment instruction outside vendor master history",
      "Urgent same-day payment pressure before trusted callback",
      "Invoice appears real but payment destination changed",
      "Bank account ownership mismatch",
      "First-seen fintech or prepaid destination"
    ],
    normal: [
      "Known vendor contact confirms instructions using trusted record",
      "Prior beneficiary remains unchanged in vendor master",
      "Verified callback completed"
    ]
  },
  CREDIT_RISK: {
    suspicious: [
      "High DTI or unsupported income",
      "Verified deposits do not support stated income",
      "DTI changes materially when using verified income",
      "High utilization or recent inquiries indicate repayment stress"
    ],
    normal: [
      "Verified income supports requested exposure",
      "Payment history remains stable",
      "Payment history is stable",
      "Complete documentation"
    ]
  },
  BUSINESS_BUSTOUT: {
    suspicious: [
      "Credit appetite exceeds verified business revenue",
      "Operating address or owner profile is thin for requested exposure",
      "Rapid credit stacking follows a dormant operating period",
      "High DTI or unsupported income",
      "Velocity spike outside normal behavior"
    ],
    normal: [
      "KYB, owner KYC, and revenue support align",
      "Business operating history supports requested credit",
      "Complete documentation"
    ]
  },
  APPLICATION: {
    suspicious: [
      "New email, first-seen device, and thin address cluster together",
      "Document address conflicts with application without support",
      "Phone or email age is too new to stabilize identity profile",
      "Device/IP inconsistent with customer history"
    ],
    normal: [
      "Identity data matches application",
      "Address proof resolves document mismatch",
      "Complete documentation"
    ]
  },
  ACH_WIRE_CHECK: {
    suspicious: [
      "Positive Pay exception conflicts with issued file",
      "Payee, endorsement, or bank-of-first-deposit mismatch",
      "Payment velocity spikes outside business history",
      "Bank account ownership mismatch",
      "Velocity spike outside normal behavior"
    ],
    normal: [
      "Issued file, image, and endorsement align",
      "Treasury callback verifies the item",
      "Complete documentation"
    ]
  }
};

export function getLaneIndicatorFilter(lane, selected = { suspicious: [], normal: [] }) {
  const filter = laneIndicatorFilters[lane] || {};
  return {
    suspicious: new Set([...(filter.suspicious || []), ...(selected.suspicious || [])]),
    normal: new Set([...(filter.normal || []), ...(selected.normal || [])])
  };
}
