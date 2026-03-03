export const STANDARD_TEMPLATES = [
    {
        name: "Mutual Non-Disclosure Agreement (NDA)",
        category: "Contract",
        content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of {{Effective Date}} by and between:

{{Disclosing Party Name}} with its principal place of business at {{Disclosing Party Address}} ("Disclosing Party")

and

{{Receiving Party Name}} with its principal place of business at {{Receiving Party Address}} ("Receiving Party")

1. PURPOSE
The parties wish to explore a potential business relationship (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by one party to the other, whether oral, written, electronic, or otherwise, that is designated as confidential or that reasonably should be understood to be confidential under the circumstances. This includes business, technical, financial, product, pricing, and customer information.

3. OBLIGATIONS
Receiving Party agrees to:
- Use Confidential Information only for the Purpose
- Not disclose Confidential Information to third parties
- Protect Confidential Information using reasonable care
- Limit access to employees/contractors with a need-to-know

4. EXCEPTIONS
Confidential Information does not include information that:
- Is or becomes publicly known without breach
- Was rightfully known before disclosure
- Is received from a third party without restriction
- Is independently developed without use of Confidential Information

5. TERM
This Agreement will remain in effect for {{Term Length}} years from the Effective Date. Confidential Information disclosed during this term will be protected for {{Protection Period}} years from disclosure.

6. RETURN OF INFORMATION
Upon request, Receiving Party shall return or destroy all Confidential Information.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date above.

_________________________          _________________________
{{Disclosing Party Name}}           {{Receiving Party Name}}
By: _____________________          By: _____________________
Title: ___________________          Title: ___________________
Date: ____________________          Date: ____________________`
    },
    {
        name: "Independent Contractor Agreement",
        category: "Contract",
        content: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement (the "Agreement") is made effective {{Effective Date}} by and between:

{{Company Name}} ("Company")
and
{{Contractor Name}} ("Contractor")

1. SERVICES
Contractor agrees to perform the following services: {{Description of Services}}.

2. PAYMENT
Company agrees to pay Contractor {{Rate}} {{Rate Period}} (e.g., $50/hour or $5,000/project). Payment shall be made within {{Payment Terms}} days of receipt of invoice.

3. TERM AND TERMINATION
This Agreement will begin on {{Start Date}} and continue until {{End Date}} unless terminated earlier. Either party may terminate this Agreement with {{Notice Period}} days written notice.

4. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor, not an employee. Contractor is responsible for all taxes, benefits, and insurance.

5. OWNERSHIP
All work product created under this Agreement shall be owned by {{Ownership Party}}.

6. CONFIDENTIALITY
Contractor agrees not to disclose Company's confidential information during or after this Agreement.

7. GOVERNING LAW
This Agreement shall be governed by the laws of {{Governing Law}}.

IN WITNESS WHEREOF, the parties have executed this Agreement.

Company:                               Contractor:
_________________________              _________________________
Signature                              Signature
_________________________              _________________________
Printed Name                           Printed Name
_________________________              _________________________
Title                                  Date`
    },
    {
        name: "Professional Invoice",
        category: "Invoice",
        content: `INVOICE

INVOICE NUMBER: {{Invoice Number}}
DATE: {{Invoice Date}}
DUE DATE: {{Due Date}}

FROM:
{{Your Company Name}}
{{Your Address}}
{{Your Email}}
{{Your Phone}}

TO:
{{Client Company Name}}
{{Client Address}}
{{Client Email}}

DESCRIPTION OF SERVICES:
{{Service Description 1}} - {{Quantity 1}} @ {{Rate 1}} = {{Subtotal 1}}
{{Service Description 2}} - {{Quantity 2}} @ {{Rate 2}} = {{Subtotal 2}}
{{Service Description 3}} - {{Quantity 3}} @ {{Rate 3}} = {{Subtotal 3}}

SUBTOTAL: {{Subtotal}}
TAX ({{Tax Rate}}%): {{Tax Amount}}
TOTAL DUE: {{Total Due}}

PAYMENT INSTRUCTIONS:
{{Payment Method}} | {{Payment Details}}

NOTES:
{{Additional Notes}}

Thank you for your business!`
    },
    {
        name: "Project Proposal / Statement of Work",
        category: "Proposal",
        content: `PROJECT PROPOSAL

PREPARED FOR: {{Client Name}}
PREPARED BY: {{Your Name/Company}}
DATE: {{Date}}
PROPOSAL VALID UNTIL: {{Expiry Date}}

PROJECT NAME: {{Project Name}}

1. EXECUTIVE SUMMARY
{{Executive Summary Text}}

2. PROJECT OBJECTIVES
- {{Objective 1}}
- {{Objective 2}}
- {{Objective 3}}

3. SCOPE OF WORK
We will deliver the following:
- {{Deliverable 1}}
- {{Deliverable 2}}
- {{Deliverable 3}}

4. TIMELINE
Project Start: {{Start Date}}
Milestone 1: {{Milestone 1 Description}} - {{Milestone 1 Date}}
Milestone 2: {{Milestone 2 Description}} - {{Milestone 2 Date}}
Project Completion: {{Completion Date}}

5. INVESTMENT
| Item | Description | Cost |
|------|-------------|------|
| {{Item 1}} | {{Description 1}} | {{Cost 1}} |
| {{Item 2}} | {{Description 2}} | {{Cost 2}} |
| {{Item 3}} | {{Description 3}} | {{Cost 3}} |
| Total | | {{Total Cost}} |

6. TERMS AND CONDITIONS
Payment terms: {{Payment Terms}}
This proposal is valid for {{Validity Period}} days.

Thank you for the opportunity to work with you. We look forward to your positive response.

_________________________
Signature`
    }
];
