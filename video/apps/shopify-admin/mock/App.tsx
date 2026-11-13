// Mock of the CAMP embedded app inside Shopify admin, for the portfolio video capture.
// Built with the same Polaris 11 components as the real app (camp/web/shopify-admin), with made-up data.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AppProvider,
  Badge,
  Button,
  Checkbox,
  DataTable,
  Frame,
  Icon,
  Layout,
  LegacyCard,
  LegacyStack,
  Modal,
  Page,
  Select,
  Text,
  TextField,
  Toast,
} from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import * as I from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import "./admin.css";
import { ADDONS, BUNDLES, LEADS, LEAD_BADGE, LOCATIONS, SLOTS, type LeadStatus } from "./data";

type View = "slots" | "edit" | "leads" | "lead";
const $ = (n: number) => `$${n.toFixed(2)}`;

const ADMIN_NAV: [string, any, string?][] = [
  ["Home", I.HomeMinor],
  ["Orders", I.OrdersMinor, "9,999+"],
  ["Products", I.ProductsMinor],
  ["Customers", I.CustomersMinor],
  ["Discounts", I.DiscountsMinor],
  ["Content", I.ContentMinor],
  ["Finance", I.FinancesMinor],
  ["Analytics", I.AnalyticsMinor],
];

function AdminShell({ view, go, children }: { view: View; go: (v: View) => void; children: React.ReactNode }) {
  const appNav: [string, any, View?][] = [
    ["Time Slots", I.CalendarMinor],
    ["Schedule (BETA)", I.CalendarMinor],
    ["Activities", I.GlobeMinor, "slots"],
    ["Queues", I.ListMinor],
    ["Store Settings", I.StoreMinor],
    ["Wishlists", I.HeartMajor],
    ["Celebrations", I.ConfettiMajor, "leads"],
  ];
  const section = view === "leads" || view === "lead" ? "Celebrations" : "Activities";
  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="logo">
          <span className="bag">S</span>
        </div>
        <div className="search"><Icon source={I.SearchMinor} /> Search <span>⌘K</span></div>
        {ADMIN_NAV.map(([label, icon, count]) => (
          <div className="item" key={label}><Icon source={icon} />{label}{count && <span className="count">{count}</span>}</div>
        ))}
        <div className="heading">Sales channels</div>
        <div className="item"><Icon source={I.OnlineStoreMinor} />Online Store</div>
        <div className="heading">Apps</div>
        <div className="item active"><span className="app-ico">◎</span>CAMP</div>
        <div className="spacer" />
        <div className="item"><Icon source={I.SettingsMinor} />Settings</div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <span className="app-ico">◎</span> CAMP
          <span className="dots"><Icon source={I.HorizontalDotsMinor} /></span>
        </header>
        <div className="app">
          <nav className="app-nav">
            <div className="loc">Location <b>5th Avenue</b></div>
            {appNav.map(([label, icon, to]) => (
              <div key={label}>
                <button className={`nav-item${label === section ? " active" : ""}`} onClick={() => to && go(to)}>
                  <Icon source={icon} />{label}
                </button>
                {label === "Celebrations" && section === "Celebrations" && (
                  <button className="nav-item sub active" onClick={() => go("leads")}>Lead List</button>
                )}
              </div>
            ))}
          </nav>
          <main className="app-body">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Slots({ go, toast }: { go: (v: View) => void; toast: (m: string) => void }) {
  const [slots, setSlots] = useState(SLOTS);
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [child, setChild] = useState("");
  const [addons, setAddons] = useState(false);
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const update = () => {
    const p = Number(child);
    setSlots((all) => all.map((s) => (selected.includes(s.id) && p ? { ...s, child: [p, ...s.child.slice(1)] } : s)));
    toast(`${selected.length} time slots updated`);
    setOpen(false);
    setSelected([]);
  };
  return (
    <Page
      title="Bluey x CAMP: Bluey's House"
      backAction={{ content: "Activities" }}
      primaryAction={{ content: "Preview" }}
      secondaryActions={[
        { content: "New Time Slot" },
        { content: "Edit Activity Type", onAction: () => go("edit") },
        { content: "View Logs" },
      ]}
      fullWidth
    >
      <LegacyStack vertical>
        <LegacyCard sectioned>
          <LegacyStack spacing="tight" alignment="center">
            <Button>Select All</Button>
            <Button disclosure>Select Days</Button>
            <Button disclosure>Visibility All</Button>
            <Button disclosure>Filter by special ticket</Button>
            <Button disclosure>All Locations</Button>
            <Button disclosure>Filter by add-ons</Button>
          </LegacyStack>
        </LegacyCard>
        {selected.length > 0 && (
          <LegacyCard sectioned>
            <LegacyStack alignment="center" distribution="equalSpacing">
              <LegacyStack alignment="center">
                <Text as="span" fontWeight="semibold">{selected.length} selected</Text>
                <Button plain onClick={() => setSelected([])}>Clear selection</Button>
              </LegacyStack>
              <LegacyStack>
                <Button>Cancel time slots</Button>
                <Button primary onClick={() => setOpen(true)}>Update</Button>
              </LegacyStack>
            </LegacyStack>
          </LegacyCard>
        )}
        <LegacyCard>
          <DataTable
            columnContentTypes={["text", "text", "text", "numeric", "numeric", "numeric"]}
            headings={["", "Location", "Time", "Price Child/GA", "Booked", "Price Points"]}
            rows={slots.map((s) => [
              <Checkbox label="" labelHidden checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />,
              s.location,
              <span className="slot-time">
                <a>{s.time}</a> {s.canceled && <Badge status="critical">Canceled</Badge>}
              </span>,
              s.child.map($).join(" - "),
              s.canceled ? "—" : `${s.booked} / 40`,
              s.points,
            ])}
          />
        </LegacyCard>
      </LegacyStack>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Update Time Slots"
        primaryAction={{ content: `Update ${selected.length} Time Slots`, onAction: update }}
        secondaryActions={[{ content: "Cancel", onAction: () => setOpen(false) }]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <TextField label="Internal reason for update" value={reason} onChange={setReason} autoComplete="off" />
            <Text variant="headingMd" as="h2">Prices</Text>
            <LegacyStack distribution="fillEvenly">
              <TextField label="Child Price" prefix="$" value={child} onChange={setChild} autoComplete="off" />
              <TextField label="Child Price Middle" prefix="$" value="" autoComplete="off" />
              <TextField label="Child Price Top" prefix="$" value="" autoComplete="off" />
            </LegacyStack>
            <Text variant="headingMd" as="h2">Ticket Bundle Prices</Text>
            <Button>Add Ticket Bundle Price change</Button>
            <Text variant="headingMd" as="h2">Addons</Text>
            <Checkbox label="Change addons" checked={addons} onChange={setAddons} />
            {addons && (
              <div className="mini-table">
                <LegacyStack vertical spacing="tight">
                  {ADDONS.slice(0, 3).map((a) => (
                    <Checkbox key={a.title} label={a.title} checked onChange={() => {}} />
                  ))}
                </LegacyStack>
              </div>
            )}
          </LegacyStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}

function EditActivity({ go, toast }: { go: (v: View) => void; toast: (m: string) => void }) {
  const [addons, setAddons] = useState(ADDONS);
  const [editing, setEditing] = useState<number | null>(null);
  const [off, setOff] = useState<string[]>([]);
  const open = (i: number) => {
    setOff(addons[i].disabledAt);
    setEditing(i);
  };
  const save = () => {
    setAddons((all) => all.map((a, i) => (i === editing ? { ...a, disabledAt: off as any } : a)));
    setEditing(null);
    toast("Add-on updated");
  };
  return (
    <Page title="Edit Activity Type" backAction={{ content: "Back", onAction: () => go("slots") }} primaryAction={{ content: "Save" }}>
      <LegacyStack vertical spacing="loose">
        <Layout>
          <Layout.Section oneThird><Text variant="headingMd" as="h2">Details</Text></Layout.Section>
          <Layout.Section>
            <LegacyCard sectioned>
              <LegacyStack vertical>
                <TextField label="Name" value="Bluey x CAMP: Bluey's House" autoComplete="off" />
                <TextField label="Tagline" value="Step inside Bluey's House for an unforgettable immersive adventure!" multiline={2} autoComplete="off" />
                <TextField label="Tags" value="Meet Bluey & Bingo, Timed Event, 50 mins, Ages 2+" autoComplete="off" helpText="Enter comma-separated tags" />
                <Checkbox label="Experience" checked />
                <Checkbox label="Is Show/Event" checked />
              </LegacyStack>
            </LegacyCard>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section oneThird>
            <Text variant="headingMd" as="h2">Addons</Text>
            <Text as="p" color="subdued">Shopify products offered while booking, with stock synced per location.</Text>
          </Layout.Section>
          <Layout.Section>
            <LegacyCard>
              <div id="addons">
                <DataTable
                  columnContentTypes={["text", "text", "numeric", "text", "text"]}
                  headings={["", "Product", "Limit", "Locations", ""]}
                  rows={addons.map((a, i) => [
                    <span className="drag"><Icon source={I.DragHandleMinor} color="subdued" /></span>,
                    <Text as="span" fontWeight="semibold">{a.title}</Text>,
                    a.limit,
                    a.disabledAt.length
                      ? <LegacyStack spacing="extraTight">{LOCATIONS.filter((l) => !a.disabledAt.includes(l)).map((l) => <Badge key={l}>{l}</Badge>)}</LegacyStack>
                      : "All locations",
                    <Button size="slim" onClick={() => open(i)}>Edit</Button>,
                  ])}
                />
              </div>
              <LegacyCard.Section><Button>Add addon</Button></LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section oneThird>
            <Text variant="headingMd" as="h2">Ticket Bundles</Text>
            <Text as="p" color="subdued">Tickets packaged with add-on slots at a bundle price.</Text>
          </Layout.Section>
          <Layout.Section>
            <LegacyCard>
              <div id="bundles">
                <DataTable
                  columnContentTypes={["text", "text", "text", "text"]}
                  headings={["", "Bundle", "Ticket", ""]}
                  rows={BUNDLES.map((b) => [
                    <span className="drag"><Icon source={I.DragHandleMinor} color="subdued" /></span>,
                    <Text as="span" fontWeight="semibold">{b.name}</Text>,
                    b.ticket,
                    <LegacyStack spacing="extraTight">
                      {b.shared && <Badge status="info">Shared</Badge>}
                      {b.badges.map((t) => <Badge key={t} status="attention">{t}</Badge>)}
                      <Badge>{`${b.slots} addon slot${b.slots > 1 ? "s" : ""}`}</Badge>
                    </LegacyStack>,
                  ])}
                />
              </div>
              <LegacyCard.Section><Button>Add ticket bundle</Button></LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </LegacyStack>
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing !== null ? addons[editing].title : ""}
        primaryAction={{ content: "Save", onAction: save }}
        secondaryActions={[{ content: "Cancel", onAction: () => setEditing(null) }]}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <TextField label="Purchasable Limit" value={editing !== null ? String(addons[editing].limit) : ""} autoComplete="off" />
            <Text variant="headingSm" as="h3">Available at</Text>
            {LOCATIONS.map((l) => (
              <Checkbox
                key={l}
                label={l}
                checked={!off.includes(l)}
                onChange={(on) => setOff((o) => (on ? o.filter((x) => x !== l) : [...o, l]))}
              />
            ))}
          </LegacyStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}

function Leads({ go }: { go: (v: View) => void }) {
  return (
    <Page title="Celebration Leads" fullWidth>
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text", "text"]}
          headings={["First Name", "Last Name", "Email", "Overall Status", "Event Date/Time", "Party area(s)"]}
          rows={LEADS.map((l, i) => [
            i === 0 ? <button className="lead-link" onClick={() => go("lead")}>{l.first}</button> : l.first,
            l.last,
            l.email,
            <Badge status={LEAD_BADGE[l.status]}>{l.status}</Badge>,
            l.date,
            l.area,
          ])}
        />
      </LegacyCard>
    </Page>
  );
}

function Lead({ go }: { go: (v: View) => void }) {
  const lead = LEADS[0];
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [orderId, setOrderId] = useState("");
  const [invoices, setInvoices] = useState([{ id: "#1042", amount: "$250.00", status: "Paid" }]);
  const track = () => {
    setInvoices((v) => [...v, { id: orderId, amount: "$1,180.00", status: "Sent" }]);
    setOrderId("");
    setStatus("Customer Invoiced");
  };
  return (
    <Page
      title="Edit Celebration Lead"
      titleMetadata={<Badge status={LEAD_BADGE[status]}>{status}</Badge>}
      backAction={{ content: "Back", onAction: () => go("leads") }}
      primaryAction={{ content: "Save" }}
    >
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned title="Host Information">
            <LegacyStack distribution="fillEvenly">
              <TextField label="First Name" value={lead.first} autoComplete="off" />
              <TextField label="Last Name" value={lead.last} autoComplete="off" />
              <TextField label="Email Address" value={lead.email} autoComplete="off" />
            </LegacyStack>
          </LegacyCard>
          <LegacyCard sectioned title="Event Details">
            <LegacyStack vertical>
              <LegacyStack distribution="fillEvenly">
                <TextField label="Event Name" value="Maya's 6th Birthday" autoComplete="off" />
                <Select label="Event Type" options={["Birthday Party"]} value="Birthday Party" />
              </LegacyStack>
              <LegacyStack distribution="fillEvenly">
                <TextField label="Event Date" value="Saturday, Dec 12, 2026" autoComplete="off" />
                <TextField label="Event Time" value="10:00 AM - 12:00 PM" autoComplete="off" />
              </LegacyStack>
              <LegacyStack distribution="fillEvenly">
                <Select label="Party Area" options={["Bluey's Backyard"]} value="Bluey's Backyard" />
                <TextField label="Number of guests" value="18 children, 12 adults" autoComplete="off" />
              </LegacyStack>
            </LegacyStack>
          </LegacyCard>
          <LegacyCard sectioned title="Invoices">
            <div id="invoices">
              <LegacyStack vertical>
                {invoices.map((inv) => (
                  <LegacyStack key={inv.id} distribution="fillEvenly" alignment="center">
                    <TextField label="Order Id" value={inv.id} autoComplete="off" />
                    <TextField label="Amount" value={inv.amount} autoComplete="off" />
                    <div className="inv-status">
                      <Badge status={inv.status === "Paid" ? "success" : "attention"}>{inv.status}</Badge>
                    </div>
                  </LegacyStack>
                ))}
                <LegacyStack alignment="trailing">
                  <LegacyStack.Item fill>
                    <TextField
                      label="Enter Shopify Order Id to track additional invoices:"
                      value={orderId}
                      onChange={setOrderId}
                      autoComplete="off"
                    />
                  </LegacyStack.Item>
                  <Button onClick={track} disabled={!orderId}>Track invoice</Button>
                </LegacyStack>
              </LegacyStack>
            </div>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section secondary>
          <LegacyCard sectioned title="Status">
            <LegacyStack vertical>
              <Select label="Overall Status" options={Object.keys(LEAD_BADGE)} value={status} onChange={(v) => setStatus(v as LeadStatus)} />
              <Select label="Contract Status" options={["Signed", "Sent", "Not sent"]} value="Signed" />
              <Select label="Camp Owner" options={["Jordan Lee"]} value="Jordan Lee" />
            </LegacyStack>
          </LegacyCard>
          <LegacyCard sectioned title="Celebrant Information">
            <LegacyStack vertical>
              <TextField label="Celebrant Name" value="Maya" autoComplete="off" />
              <TextField label="Celebrant Age" value="6" autoComplete="off" />
            </LegacyStack>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function App() {
  const [view, setView] = useState<View>((location.hash.slice(1) as View) || "slots");
  const [toast, setToast] = useState("");
  const go = (v: View) => {
    location.hash = v;
    scrollTo(0, 0);
    setView(v);
  };
  return (
    <AppProvider i18n={en}>
      <Frame>
        <AdminShell view={view} go={go}>
          {view === "slots" && <Slots go={go} toast={setToast} />}
          {view === "edit" && <EditActivity go={go} toast={setToast} />}
          {view === "leads" && <Leads go={go} />}
          {view === "lead" && <Lead go={go} />}
        </AdminShell>
        {toast && <Toast content={toast} onDismiss={() => setToast("")} />}
      </Frame>
    </AppProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
