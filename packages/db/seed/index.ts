import { PrismaClient, PlanTier, CaregiverRole, RoutineCategory, DiagnosisPhase, ConsentStatus } from "../generated/client"

const prisma = new PrismaClient()

async function main() {
  // Demo user
  const user = await prisma.user.upsert({
    where: { email: "ana@neuroplus.app" },
    update: {},
    create: {
      email: "ana@neuroplus.app",
      name: "Ana Silva",
      plan: PlanTier.PREMIUM,
    },
  })

  // Family profile
  const family = await prisma.family.upsert({
    where: { id: "seed-family-1" },
    update: {},
    create: {
      id: "seed-family-1",
      childName: "João",
      childBirthDate: new Date("2018-03-15"),
      diagnosisPhase: DiagnosisPhase.IN_PROGRESS,
      members: {
        create: { userId: user.id, role: CaregiverRole.MOM },
      },
    },
  })

  // Routine entries (last 15 days)
  const now = new Date()
  for (let i = 0; i < 15; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)

    await prisma.routineEntry.createMany({
      data: [
        {
          familyId: family.id,
          category: RoutineCategory.SLEEP,
          occurredAt: new Date(d.setHours(21, 0, 0)),
          durationMin: 420 + Math.floor(Math.random() * 90 - 45),
          notes: null,
        },
        {
          familyId: family.id,
          category: RoutineCategory.FEEDING,
          occurredAt: new Date(d.setHours(12, 30, 0)),
          severity: null,
          notes: i % 3 === 0 ? "Recusou almoço" : null,
        },
      ],
      skipDuplicates: true,
    })

    // Crisis on tuesdays (simulating pattern)
    if (d.getDay() === 2) {
      await prisma.routineEntry.create({
        data: {
          familyId: family.id,
          category: RoutineCategory.CRISIS,
          occurredAt: new Date(d.setHours(15, 0, 0)),
          severity: 3,
          durationMin: 20,
          notes: "Sensível ao barulho",
        },
      })
    }
  }

  // Consents
  await prisma.consent.createMany({
    data: [
      {
        familyId: family.id,
        grantedToEmail: "escola@municipal.edu.br",
        grantedToRole: "Escola",
        dataScope: "evolucao_escolar",
        status: ConsentStatus.GRANTED,
      },
      {
        familyId: family.id,
        grantedToEmail: "dra.ana@terapia.com",
        grantedToRole: "Terapeuta",
        dataScope: "relatorio_terapia",
        status: ConsentStatus.GRANTED,
      },
    ],
    skipDuplicates: true,
  })

  // AI insight (locked for free users)
  await prisma.aiInsight.create({
    data: {
      familyId: family.id,
      title: "Padrão de crises nas terças-feiras",
      description: "Detectamos que 80% das crises do João ocorrem às terças-feiras, correlacionadas com sono abaixo de 7h na noite anterior.",
      lockedForFree: true,
      data: { pattern: "tuesday_crisis", correlation: "sleep_deficit", confidence: 0.8 },
    },
  })

  // Notes
  await prisma.note.createMany({
    data: [
      {
        userId: user.id,
        familyId: family.id,
        text: "Ele ficou muito ansioso antes da consulta de hoje, não queria sair de casa.",
        insight: "Padrão observado: ansiedade pré-consulta apareceu 3 vezes esse mês.",
        createdAt: new Date(),
      },
      {
        userId: user.id,
        familyId: family.id,
        text: "Dormiu bem essa semana. Rotina de dormir às 21h parece estar funcionando.",
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
  })

  console.log("Seed concluído.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
