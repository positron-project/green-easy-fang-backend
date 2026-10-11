/**
 * 将后端 ISO 字符串（如 2026-03-13T16:00:00.000+00:00）或 Date 格式化为中文本地日期。
 */
export function formatEnvContentDate(
  input: string | Date | number | null | undefined
): string {
  if (input == null || input === '') return ''
  const d = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
